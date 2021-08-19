import { NextFunction, Request, Response } from "express";
import OktaJwtVerifier = require("@okta/jwt-verifier");

import { handler } from "../handlers";

import { oktaConfig, STATUS_CODES } from "../constants/app.constants";
import { ERROR_MSGS } from "../constants/message.constants";

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: oktaConfig.issuer,
  client_id: oktaConfig.clientId,
  client_secret: oktaConfig.clientSecret,
});

const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  const authToken = authorization.match(/Bearer (.+)/);

  if (!authToken) {
    return handler.sendError(
      STATUS_CODES.Unauthorized,
      ERROR_MSGS.Unauthorized,
      next
    );
  }

  const accessToken = authToken[1];
  return oktaJwtVerifier
    .verifyAccessToken(accessToken, oktaConfig.audience)
    .then((token) => {
      req["authorization"] = token;
      next();
    })
    .catch((err) => {
      return handler.sendError(STATUS_CODES.Unauthorized, err, next);
    });
};

export default authMiddleWare;
