require("dotenv").config();
import { constructJwtMiddleware } from "./jwt_middleware";

export function createJwtMiddleware() {
  // add your CANVA_APP_ID to the .env file at the root level
  const appId = process.env.CANVA_APP_ID;
  if (!appId) {
    throw new Error(
      `'CANVA_APP_ID' environment variable is undefined. Refer to the instructions in the README.md on starting a backend example.`
    );
  }

  return constructJwtMiddleware(appId);
}
