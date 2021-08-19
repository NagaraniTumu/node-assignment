import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";

import { HttpException, logger } from "./index";

import { STATUS_CODES } from "../constants/app.constants";

class Handler {
  sendError = (status: number, message: string, next: NextFunction) => {
    return next(new HttpException(status, message));
  };

  send = (req: Request, res: Response, message: string, data?: any) => {
    this.logSuccess(req.url, message, data);
    res.send({
      statusCode: STATUS_CODES.Success,
      message: message,
      data: data,
    });
  };

  log = (req: Request) => {
    logger.app.info(`Request to an api ${req.method} ${req.path}`, {
      transactionId: this.getTransId(req.headers),
      url: req.url,
      headers: req.headers,
      params: req.params,
      reqBody: req.body,
    });
  };

  logError = (req: Request, error: any | HttpException) => {
    logger.app.error(`Error occured at ${req.method} ${req.path}`, {
      transactionId: this.getTransId(req.headers),
      host: req.hostname,
      url: req.url,
      reqBody: req.body,
      error: error,
    });
  };

  logSuccess = (url: string, message: string, data = {}) => {
    logger.app.info(`Response from an api ${url}`, {
      message: message,
      data: data,
    });
  };

  getTransId = (headers: IncomingHttpHeaders) => {
    return headers["transaction-id"];
  };
}

const handler = new Handler();
export { handler };

// const sendError = (status: number, message: string, next: NextFunction) => {
//   return next(new HttpException(status, message));
// };

// const send = (req: Request, res: Response, message: string, data?: any) => {
//   logSuccess(req.url, message, data);
//   res.send({
//     statusCode: STATUS_CODES.Success,
//     message: message,
//     data: data,
//   });
// };

// const log = (req: Request) => {
//   logger.app.info(`Request to an api ${req.method} ${req.path}`, {
//     transactionId: getTransId(req.headers),
//     url: req.url,
//     headers: req.headers,
//     params: req.params,
//     reqBody: req.body,
//   });
// };

// const logError = (req: Request, error: any | HttpException) => {
//   logger.app.error(`Error occured at ${req.method} ${req.path}`, {
//     transactionId: getTransId(req.headers),
//     host: req.hostname,
//     url: req.url,
//     reqBody: req.body,
//     error: error,
//   });
// };

// const logSuccess = (url: string, message: string, data = {}) => {
//   logger.app.info(`Response from an api ${url}`, {
//     message: message,
//     data: data,
//   });
// };

// const getTransId = (headers: IncomingHttpHeaders) => {
//   return headers["transaction-id"];
// };
