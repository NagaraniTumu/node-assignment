import { NextFunction, Request, Response } from "express";
import { ValidationErrorItem } from "joi";

import { HttpException, handler } from "../handlers";

import { STATUS_CODES } from "../constants/app.constants";

function errorMiddleware(
  error: any | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  handler.logError(req, error);

  if (error && error.type) {
    res.status(400).send(reqValidation(error.type, error.error.details));
  } else {
    res.status(error.statusCode).send(resValidation(error));
  }
  next();
}

function reqValidation(type: string, errDetails: ValidationErrorItem[]) {
  const status = 400;
  return {
    statusCode: status,
    message: `${type}: ${errDetails.map((x) => x.message).join(", ")}`,
    errorType: `${status} ${STATUS_CODES[status]}`,
  };
}

function resValidation(error: HttpException) {
  return {
    statusCode: error.statusCode || 500,
    message: error.message || "Something went wrong",
    errorType: error.errorType || "500 Internal server error",
  };
}

export default errorMiddleware;
