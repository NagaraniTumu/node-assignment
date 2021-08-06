import * as express from "express";

import DBService from "../services/db.service";
import errorMiddleware from "../middleware/error.middleware";
import { logger } from "../handlers/logger";

import BookRoutes from "../routes/book.routes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.initializeLogging();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeLogging() {
    this.app.use(logger.express);
  }

  private initializeRoutes() {
    BookRoutes.route(this.app);
  }

  private connectToDatabase() {
    DBService.connectDB();
  }
}

export default new App().app;
