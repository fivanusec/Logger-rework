import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  timestamp: String,
  level: String,
  requestId: String,
  service: String,
  message: String,
});

export default logSchema;
