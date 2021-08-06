import { configure, getLogger, connectLogger } from "log4js";

const _logPath = process.env.LOG_DIR || "logs";

configure({
  appenders: {
    console: { type: "stdout", layout: { type: "colored" } },
    app: {
      type: "dateFile",
      filename: `${_logPath}/app.log`,
      pattern: "-yyyy-MM-dd",
      compress: true,
      daysToKeep: 14,
      keepFileExt: true,
    },
  },
  categories: {
    console: { appenders: ["console", "app"], level: "INFO" },
    default: { appenders: ["app"], level: "ALL" },
  },
});

// fetch logger and export
export const logger = {
  console: getLogger("console"),
  app: getLogger("app"),
  express: connectLogger(getLogger("access"), {
    level: "INFO",
  }),
};
