import winston from "winston";
import path from "path";
import clc from "cli-color";
import { DatabaseTransport } from "./loggerDbTransport";

// Required types for logger messages
export type LogData = {
  level?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
  [key: string]: unknown;
};
type LogLevels = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

/**
 * Logger class: This class is used to create a logger instance for a service
 *
 * @param serviceName Name of the service
 * @param instance Instance of winston logger
 * @param sampleJSONFormat Format for JSON logs
 * @param sampleConsoleFormat Format for console logs
 */
export default class Logger<T extends string> {
  private instance: winston.Logger;

  /**
   * Format for JSON logs which are stored in files
   * @param level Log level
   * @param message Log message
   * @param requestId Request ID
   * @returns Formatted JSON string
   */
  private sampleJSONFormat = winston.format.printf(({ level, message, requestId }) => {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      requestId,
      service: this.serviceName,
      message,
    });
  });

  /**
   * Format for console logs which are printed in console
   * @param level Log level
   * @param message Log message
   * @param requestId Request ID
   * @returns Formatted string
   */

  private sampleConsoleFormat = winston.format.printf(({ level, message, requestId }) => {
    const msg = `[${level}]::${clc.yellow(`[${this.serviceName}]`)}${
      requestId ? `::[${requestId}]` : ""
    } ${new Date().toISOString()} ==> ${message}`;
    return msg;
  });

  constructor(private serviceName: T) {
    // Construct instance of logger
    this.instance = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: path.join(__dirname, "/../../logs/errorLogger.log"),
          level: "error",
          format: this.sampleJSONFormat,
        }),
        new winston.transports.File({
          filename: path.join(__dirname, "/../../logs/logger.log"),
          format: this.sampleJSONFormat,
        }),
        new DatabaseTransport(this.serviceName, {}),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      this.instance.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.simple(), winston.format.colorize(), this.sampleConsoleFormat),
        }),
      );
    }
  }

  info(data: LogData) {
    this.instance.info(data);
  }
  debug(data: LogData) {
    this.instance.debug(data);
  }
  error(data: LogData) {
    this.instance.error(data);
  }
  fatal(data: LogData) {
    this.instance.error(data);
  }
  warn(data: LogData) {
    this.instance.warn(data);
  }
  log(level: LogLevels, data: LogData) {
    this.instance.log(level.toString(), data);
  }
}
