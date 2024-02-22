import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import routes from "../controller";

import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: ["https://afterschoolapp-l7hwzj4r1-istine.vercel.app"],
    credentials: true,
  })
);

routes(app);

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("not found");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);

  if (res.headersSent) {
    console.log((error as Error).message);
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

export default app;
