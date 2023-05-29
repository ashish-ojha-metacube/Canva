require("dotenv").config();
import * as express from "express";
import fetch, { Response } from "node-fetch";

const app = express();
app.use(express.json());

/**
 * This endpoint loads an image from the URL specified by the query parameter 'url', and returns it
 * with very permissive CORS headers, to enable your app to display it in an <img/> tag.
 *
 * Note: you will need to ensure that this is served on a HTTPS endpoint.
 *
 * @example
 * http://localhost:3001/image?url=https://picsum.photos/200/300
 */
app.get("/image", async (req, res) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    res.statusCode = 400;
    return res.send({
      message: "'URL' query param missing from request.",
    });
  }

  let imageResponse: Response;
  try {
    imageResponse = await fetch(imageUrl);
    if (!imageResponse.body) {
      throw new Error("Response body is null.");
    }
  } catch (error) {
    res.statusCode = 400;
    return res.send({
      message: `Unable to fetch image from ${imageUrl}.`,
    });
  }

  // Forward general headers
  imageResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  // Set image extension type if it is set on the original response
  const contentType = imageResponse.headers.get("content-type");
  contentType && res.setHeader("content-type", contentType);

  // Website you wish to allow to connect. * means all websites
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  return imageResponse.body.pipe(res);
});

app.listen(process.env.CANVA_BACKEND_PORT);
