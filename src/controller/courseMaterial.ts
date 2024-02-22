import express, { Request, Response, NextFunction } from "express";
import { ExpressType } from "../types";
import { IsUserAuthorized, errorHandler } from "../middleware";
import { deleteCourseMaterialById } from "../service/courseMaterial";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { errorResponse, successResponse } from "../lib";

export default (app: ExpressType) => {
  const router = express.Router();

  app.use("/api/courseMaterial", router);

  router.delete(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const deletedCourseMaterial = await deleteCourseMaterialById(
        req.params.id
      );
      if (!deletedCourseMaterial)
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK);
    })
  );
};
