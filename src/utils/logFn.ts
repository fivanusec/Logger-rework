import { v4 } from "uuid";
import { logger } from "./constructLogger";

export const Log = (funcName: string) => {
  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const start = new Date().getTime();
      const requestId = v4();
      logger.info({
        message: `Run endpoint ${funcName}`,
        date: new Date().toISOString(),
        requestId,
        functon: funcName,
      });
      const result = original.apply(this, args);
      logger.info({
        message: `Endpoint ${funcName} finished successfully with execution time: ${(
          new Date().getTime() - start
        ).toFixed(2)} ms`,
        requestId,
      });
      return result;
    };
  };
};
