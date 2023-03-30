import express from "express";
import { TestController } from "./Controllers/controller";

const app = express();
const controller = new TestController();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", controller.testController.bind(controller));

app.get("/2", controller.testController2.bind(controller));

export default app;
