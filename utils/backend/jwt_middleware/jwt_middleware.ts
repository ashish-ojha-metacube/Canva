import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JwksClient, SigningKeyNotFoundError } from "jwks-rsa";
import * as debug from "debug";

/**
 * Prefix your start command with `DEBUG=express:middleware:jwt` to enable debug logging
 * for this middleware
 */
const debugLogger = debug("express:middleware:jwt");

/**
 * Augment the Express request context to include the appId/userId/brandId fields decoded
 * from the JWT.
 */
declare module "express-serve-static-core" {
  export interface Request {
    canva: {
      appId: string;
      userId: string;
      brandId: string;
    };
  }
}

type CanvaJwt = Omit<jwt.Jwt, "payload"> & {
  payload: {
    aud?: string;
    userId?: string;
    brandId?: string;
  };
};

const PUBLIC_KEY_DEFAULT_EXPIRY_MS = 60 * 60 * 1_000; // 60 minutes
const PUBLIC_KEY_DEFAULT_FETCH_TIMEOUT_MS = 30 * 1_000; // 30 seconds

const sendUnauthorizedResponse = (res: Response, message?: string) =>
  res.status(401).json({ error: "unauthorized", message });

const createJwksUrl = (appId: string) =>
  `https://api.canva.com/rest/v1/apps/${appId}/jwks`;

/**
 * jwtMiddleware is an express middleware function that extracts the token
 * from the Authorization header of the request.
 *
 * The token must be in the `Authorization` header with the `Bearer` prefix.
 *
 * This middleware will verify and decode the token, adding the user/brand/app ID
 * to the request canva context object, enabling your route handlers to easily retrieve them
 * via `req.canva.userId`/`req.canva.brandId`/`req.canva.appId`.
 */
export const constructJwtMiddleware = (
  appId: string
): ((req: Request, res: Response, next: NextFunction) => void) => {
  const jwksClient = new JwksClient({
    cache: true,
    cacheMaxAge: PUBLIC_KEY_DEFAULT_EXPIRY_MS,
    timeout: PUBLIC_KEY_DEFAULT_FETCH_TIMEOUT_MS,
    rateLimit: true,
    jwksUri: createJwksUrl(appId),
  });

  return async (req, res, next) => {
    try {
      debugLogger(`processing JWT for '${req.url}'`);
      if (!req.headers.authorization) {
        return sendUnauthorizedResponse(res, "Missing 'Authorization' header");
      }

      if (!req.headers.authorization.match(/^Bearer\s+[a-z0-9+\\=]/i)) {
        console.trace(
          `jwtMiddleware: failed to match token in Authorization header`
        );
        return sendUnauthorizedResponse(res, "Invalid token format");
      }

      const token = req.headers.authorization.replace(/^Bearer\s+/i, "");
      if (!token) {
        console.trace(
          `jwtMiddleware: failed to extract token from Authorization header`
        );
        return sendUnauthorizedResponse(res, "Invalid token format");
      }

      const unverifiedDecodedToken = jwt.decode(token, {
        complete: true,
      });

      if (unverifiedDecodedToken?.header?.kid == null) {
        console.trace(
          `jwtMiddleware: expected token to contain 'kid' claim header`
        );
        return sendUnauthorizedResponse(res);
      }

      const key = await jwksClient.getSigningKey(
        unverifiedDecodedToken.header.kid
      );
      const publicKey = key.getPublicKey();
      const verifiedToken = jwt.verify(token, publicKey, {
        audience: appId,
        complete: true,
      }) as CanvaJwt;
      const { payload } = verifiedToken;
      debugLogger("payload: %O", payload);

      if (
        payload.userId == null ||
        payload.brandId == null ||
        payload.aud == null
      ) {
        console.trace(
          "jwtMiddleware: failed to decode jwt missing fields from payload"
        );
        return sendUnauthorizedResponse(res);
      }

      req.canva = {
        appId: payload.aud,
        brandId: payload.brandId,
        userId: payload.userId,
      };

      next();
    } catch (e) {
      if (e instanceof SigningKeyNotFoundError) {
        return sendUnauthorizedResponse(res, "Public key not found");
      }

      if (e instanceof jwt.JsonWebTokenError) {
        return sendUnauthorizedResponse(res, "Token is invalid");
      }

      if (e instanceof jwt.TokenExpiredError) {
        return sendUnauthorizedResponse(res, "Token expired");
      }

      next(e);
    }
  };
};
