import express, { Request, Response, NextFunction } from "express";
import { ExpressType } from "../types";
import { IsUserAuthorized, errorHandler } from "../middleware";

import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default (app: ExpressType) => {
  const router = express.Router();

  app.use("/api", router);

  router.get(
    "/auth",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      return res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
    })
  );
};
