import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

import { getURL } from "@/utils/helpers";
import { getPublicEnv } from "@/utils/env";

interface LogDetails {
  module: string;
  msg: string;
  userId?: string;
}

class Logger {
  module: string;
  logger: pino.Logger;
  is_localhost: boolean;

  constructor(module: string) {
    const apiKey =
      getPublicEnv("NEXT_PUBLIC_LOGFLARE_API_TOKEN") ??
      "76ba79dd-d85a-42cc-854f-8eaadbe1e095";
    const sourceToken =
      getPublicEnv("NEXT_PUBLIC_LOGFLARE_CLIENT_TOKEN") ?? "woM7iW_BIlR3";
    if (!apiKey || !sourceToken) {
      throw new Error(
        `Logflare API key and source token must be configured! apiKey: ${apiKey}; sourceToken: ${sourceToken}`,
      );
    }

    const { stream, send } = logflarePinoVercel({
      apiKey,
      sourceToken,
    });

    this.module = module;
    this.logger = pino(
      {
        browser: {
          transmit: {
            level: "info",
            send: send,
          },
        },
        level: "info",
      },
      stream,
    );
    this.is_localhost = getURL() == "http://localhost:3000/";
  }

  private getDetails(msg: string, userId?: string) {
    const details: LogDetails = {
      module: this.module,
      msg: msg,
    };
    if (userId) details.userId = userId;
    return details;
  }

  debug(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    if (this.is_localhost) {
      console.debug(`DEBUG: ${JSON.stringify(details)}`);
    }
  }

  info(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    if (this.is_localhost) {
      console.info(`INFO: ${JSON.stringify(details)}`);
    } else {
      try {
        this.logger.info(details);
      } catch (error) {
        console.error(`Logger failed with ${JSON.stringify(error)}`);
      }
    }
  }

  warn(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    console.warn(`WARN: ${JSON.stringify(details)}`);
    if (getURL() != "http://localhost:3000/") {
      try {
        this.logger.warn(details);
      } catch (error) {
        console.error(`Logger failed with ${JSON.stringify(error)}`);
      }
    }
  }

  error(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    console.error(`ERROR: ${JSON.stringify(details)}`);
    if (!this.is_localhost) {
      try {
        this.logger.error(details);
      } catch (error) {
        console.error(`Logger failed with ${JSON.stringify(error)}`);
      }
    }
  }

  fatal(msg: string, userId?: string): void {
    const details = this.getDetails(msg, userId);
    console.error(`FATAL: ${JSON.stringify(details)}`);
    if (!this.is_localhost) {
      try {
        this.logger.fatal(details);
      } catch (error) {
        console.error(`Logger failed with ${JSON.stringify(error)}`);
      }
    }
  }
}

export default Logger;
