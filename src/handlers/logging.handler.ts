import { Request } from "express";
import { IncomingHttpHeaders } from "http";

import HttpException from "./http.handler";

import { logger } from "./logger";

class LoggingHandler {
  public log(req: Request) {
    logger.app.info(`Request to an api ${req.method} ${req.path}`, {
      transactionId: this.getTransId(req.headers),
      url: req.url,
      headers: req.headers,
      params: req.params,
      reqBody: req.body,
    });
  }

  public logError(req: Request, error: any | HttpException) {
    logger.app.error(`Error occured at ${req.method} ${req.path}`, {
      transactionId: this.getTransId(req.headers),
      host: req.hostname,
      url: req.url,
      reqBody: req.body,
      error: error,
    });
  }

  public logSuccess(url: string, message: string, data = {}) {
    logger.app.info(`Response from an api ${url}`, {
      message: message,
      data: data,
    });
  }

  public getTransId(headers: IncomingHttpHeaders) {
    return headers["transaction-id"];
  }
}

export default new LoggingHandler();
