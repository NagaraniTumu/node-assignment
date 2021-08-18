import app from "./src/config/app";
import { logger } from "./src/handlers";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  logger.console.info(`Server is listening on port ${PORT}`)
);
