import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino({
  level: isProd ? "info" : "debug",
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GIT_COMMIT_SHA || "local",
  },
  redact: ["req.headers.authorization", "password", "cookie"],
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
});

export const createLogger = (moduleName: string) => {
  return logger.child({ module: moduleName })
} 
