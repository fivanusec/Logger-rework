import Transport from "winston-transport";
import logSchema from "./loggerSchema";
import mongoose from "mongoose";
import type { LogData } from "./logger";
import type { TransportStreamOptions } from "winston-transport";

export class DatabaseTransport extends Transport {
  constructor(private serviceName: string, opts: TransportStreamOptions) {
    super(opts);
  }

  private async mongoStore(data: LogData) {
    const model = mongoose.model(
      `log_${this.serviceName ?? "general"}`,
      logSchema,
      `log_${this.serviceName ?? "general"}`,
    );
    const newLogEntry = new model({
      ...data,
      service: this.serviceName,
    });
    newLogEntry.save();
  }

  public async log(info: LogData, next: () => void) {
    this.mongoStore(info);
    next();
  }
}
