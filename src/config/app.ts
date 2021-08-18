import * as express from "express";
import * as session from "express-session";
import { ExpressOIDC } from "@okta/oidc-middleware";

import { dbService } from "../services";

import { errorMiddleware } from "../middleware";
import { handler, logger } from "../handlers";

import routes from "../routes";

import { oktaConfig, sessionOptions } from "../constants/app.constants";

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

    const oidc = new ExpressOIDC({
      appBaseUrl: oktaConfig.baseUrl,
      issuer: oktaConfig.issuer,
      client_id: oktaConfig.clientId,
      client_secret: oktaConfig.clientSecret,
      redirect_uri: oktaConfig.redirectUrl,
      scope: oktaConfig.scope,
      routes: {
        loginCallback: {
          path: oktaConfig.callbackPath,
        },
      },
    });

    this.app.use(session(sessionOptions));

    this.app.use(oidc.router);

    this.app.get("/", (req, res) => {
      const userContext = req["userContext"];
      if (userContext) {
        res.send(
          `access token => ${userContext.tokens.token_type} ${userContext.tokens.access_token}`
        );
      } else {
        res.send('Please <a href="/login">login</a>');
      }
    });
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
