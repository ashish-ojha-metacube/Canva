import { NextFunction, Request, Response } from "express";
import { DecodeOptions, Jwt, Secret, VerifyOptions } from "jsonwebtoken";
import type { JwksClient, SigningKey } from "jwks-rsa";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

describe("constructJwtMiddleware", () => {
  const FAKE_APP_ID = "AAAAAAAAAA1";
  const FAKE_BRAND_ID = "BAAAAAAAAA1";
  const FAKE_USER_ID = "UAAAAAAAAA1";
  const FAKE_JWKS_URI = "https://api.canva.com/rest/v1/apps/AAAAAAAAAA1/jwks";

  class FakeSigningKeyNotFoundError extends Error {}
  class FakeJsonWebTokenError extends Error {}
  class FakeTokenExpiredError extends Error {}

  let verify: jest.MockedFn<
    (
      token: string,
      secretOrPublicKey: Secret,
      options: VerifyOptions & { complete: true }
    ) => Jwt
  >;
  let decode: jest.MockedFn<
    (token: string, options: DecodeOptions & { complete: true }) => Jwt | null
  >;

  let getPublicKey: jest.MockedFn<() => string>;
  let getSigningKey: jest.MockedFn<
    (kid?: string | null | undefined) => Promise<SigningKey>
  >;
  let client: jest.Mocked<typeof JwksClient>;

  let req: Request;
  let res: Response;
  let next: jest.MockedFn<() => void>;

  let constructJwtMiddleware: (appId: string) => Middleware;
  let jwtMiddleware: Middleware;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    verify = jest.fn();
    decode = jest.fn();

    getPublicKey = jest.fn().mockReturnValue("public-key");
    getSigningKey = jest.fn().mockResolvedValue({
      getPublicKey,
    });

    client = jest.fn().mockImplementation(() => ({
      getSigningKey,
    }));

    jest.doMock("jsonwebtoken", () => ({
      verify,
      decode,
      JsonWebTokenError: FakeJsonWebTokenError,
      TokenExpiredError: FakeTokenExpiredError,
    }));

    jest.doMock("jwks-rsa", () => ({
      JwksClient: client,
      SigningKeyNotFoundError: FakeSigningKeyNotFoundError,
    }));

    constructJwtMiddleware =
      require("../jwt_middleware").constructJwtMiddleware;
  });

  describe("Before called", () => {
    it("Creates a JwksClient", async () => {
      expect.assertions(3);

      expect(client).not.toHaveBeenCalled();
      jwtMiddleware = constructJwtMiddleware(FAKE_APP_ID);

      expect(client).toHaveBeenCalledTimes(1);
      expect(client).toHaveBeenLastCalledWith({
        cache: true,
        cacheMaxAge: 3_600_000,
        timeout: 30_000,
        rateLimit: true,
        jwksUri: FAKE_JWKS_URI,
      });
    });
  });

  describe("When called", () => {
    beforeEach(() => {
      req = {
        headers: {},
      } as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      next = jest.fn();

      jwtMiddleware = constructJwtMiddleware(FAKE_APP_ID);
    });

    describe("When the 'Authorization' header is missing", () => {
      beforeEach(() => {
        delete req.headers.authorization;
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Missing the 'Authorization' header"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Missing 'Authorization' header",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the 'Authorization' header doesn't have a Bearer scheme", () => {
      beforeEach(() => {
        req.headers.authorization = "Beerer FAKE_JWT";
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Invalid token format"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Invalid token format",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the 'Authorization' Bearer scheme header doesn't have a token", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer ";
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Invalid token format"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Invalid token format",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the 'JWT doesn't have a key id", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
          },
          payload: {},
          signature: "fake-signature",
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When there's no public key with the provided key id", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        getSigningKey.mockRejectedValue(new FakeSigningKeyNotFoundError());
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Public key not found"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Public key not found",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the middleware cannot verify the token", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockImplementation(() => {
          throw new FakeJsonWebTokenError();
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Token is invalid"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Token is invalid",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the token has expired", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockImplementation(() => {
          throw new FakeTokenExpiredError();
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Token expired"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Token expired",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload has no userId", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            brandId: FAKE_BRAND_ID,
            aud: FAKE_APP_ID,
          },
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload has no brandId", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            userId: FAKE_USER_ID,
            aud: FAKE_APP_ID,
          },
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload has no aud", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            userId: FAKE_USER_ID,
            brandId: FAKE_BRAND_ID,
          },
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload is valid", () => {
      beforeEach(() => {
        req.headers.authorization = "Bearer JWT";

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            userId: FAKE_USER_ID,
            brandId: FAKE_BRAND_ID,
            aud: FAKE_APP_ID,
          },
        });
      });

      it(`Sets the userId, brandId, and aud as appId in request.canva, and calls next()`, async () => {
        expect.assertions(4);

        await jwtMiddleware(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

        expect(req.canva).toEqual({
          userId: FAKE_USER_ID,
          brandId: FAKE_BRAND_ID,
          appId: FAKE_APP_ID,
        });
        expect(next).toHaveBeenCalledTimes(1);
      });
    });
  });
});
