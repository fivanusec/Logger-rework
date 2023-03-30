import mongoose from "mongoose";
import app from "./server";
import { logger } from "./utils/constructLogger";

void (async () => {
  await mongoose.connect("mongodb://localhost:27017/test");
  app.listen(4000, () => {
    logger.info({ message: "App service started on port ::4000" });
  });
})();
