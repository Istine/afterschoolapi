import express, { Request, Response, NextFunction } from "express";
import { ExpressType } from "../types";
import { IsUserAuthorized, errorHandler } from "../middleware";
import {
  createModules,
  deleteModuleById,
  getAllModules,
  getModuleById,
  updateModule,
} from "../service/module";
import { errorResponse, successResponse } from "../lib";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export default (app: ExpressType) => {
  const router = express.Router();

  app.use("/api/module", router);

  router.post(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const modules = await createModules(req.body);
      if (!modules) {
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST
        );
      }

      return successResponse(res, StatusCodes.CREATED, ReasonPhrases.CREATED, {
        modules,
      });
    })
  );

  router.put(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const updatedModule = await updateModule(req.body.id, req.body);
      if (!updatedModule) {
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST
        );
      }

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        module: updatedModule,
      });
    })
  );

  router.get(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const modules = await getAllModules();

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        modules,
      });
    })
  );

  router.get(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const module = await getModuleById(req.params.id);

      if (!module) {
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        module,
      });
    })
  );

  router.delete(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const module = await deleteModuleById(req.params.id);
      if (!module)
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST
        );

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK);
    })
  );
};
