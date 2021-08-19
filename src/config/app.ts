import * as express from "express";
import { dbService } from "../services";

import { errorMiddleware } from "../middleware";
import { handler, logger } from "../handlers";

import routes from "../routes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeLogging();
    this.connectToDatabase();
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
    this.app.use((req, res, next) => {
      handler.log(req);
      next();
    });

    this.app.use(routes);
  }

  private connectToDatabase() {
    dbService.connectDB();
  }
}

export default new App().app;
