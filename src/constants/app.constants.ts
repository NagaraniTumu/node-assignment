import * as dotenv from "dotenv";
dotenv.config();

export const oktaConfig = {
  baseUrl: process.env.HOST_URL,
  issuer: process.env.ISSUER,
  clientId: process.env.OKTA_CLIENT_ID,
  clientSecret: process.env.OKTA_CLIENT_SECRET,
  scope: process.env.SCOPE,
  audience: process.env.AUDIENCE,
  grantType: process.env.GRANT_TYPE,
};

export const DBCONFIG = {
  username: "rani",
  password: "rani@123",
  database: "booksdb",
};

export const CONNECTION_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export enum STATUS_CODES {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}
