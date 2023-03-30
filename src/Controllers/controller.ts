import { Log } from "../utils/logFn";
import type { Request, Response } from "express";

export class TestController {
  @Log("testController")
  public testController(_req: Request, res: Response): void {
    res.status(200).send("Hello World!");
  }

  @Log("testController2")
  public testController2(_req: Request, res: Response) {
    return res.status(200).send("Hello World!");
  }
}
