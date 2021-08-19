import { connect } from "mongoose";

import { logger } from "../handlers/logger";

import { DBCONFIG, CONNECTION_OPTIONS } from "../constants/app.constants";

class DBService {
  public connectDB(): void {
    connect(this.getConnectionString(), CONNECTION_OPTIONS)
      .then(() => logger.console.info("Connected to DB."))
      .catch((err) => logger.app.error(err));
  }

  private getConnectionString(): string {
    return (
      "mongodb+srv://" +
      DBCONFIG.username +
      ":" +
      DBCONFIG.password +
      "@cluster0.kqxbg.mongodb.net/" +
      DBCONFIG.database +
      "?retryWrites=true&w=majority"
    );
  }
}

export const dbService = new DBService();
