import { Request, Response, NextFunction } from "express";

import { authService } from "../services";

import { handler } from "../handlers";

import { STATUS_CODES } from "../constants/app.constants";

class AuthController {
  public async getAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = await authService.getAccessToken();

      return res.status(200).json(accessToken);
    } catch (err) {
      return handler.sendError(
        STATUS_CODES.InternalServerError,
        err.message,
        next
      );
    }
  }
}

export const authController = new AuthController();
