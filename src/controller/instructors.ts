import express, { Request, Response, NextFunction } from "express";
import { ExpressType, instructorKeyType, instructorType } from "../types";
import { IsUserAuthorized, errorHandler } from "../middleware";
import {
  createInstructor,
  delteInstructorById,
  getAllInstructors,
  getInstructorById,
  updateInstructorById,
} from "../service/instructor";
import { errorResponse, successResponse } from "../lib";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import busboy from "busboy";
import { deleteFromBucket, uploadToBucket } from "../service/s3";
import config from "../config";
import { multipartFormHander } from "../middleware/instructor";

export default (app: ExpressType) => {
  const router = express.Router();
  app.use("/api/instructor", router);

  router.use(
    express.raw({
      limit: "10mb",
      type: "multipart/form-data",
      verify: (req, res, buf) => {
        (req as { [key: string]: any }).rawBody = buf;
      },
    })
  );

  router.post(
    "/",
    IsUserAuthorized,
    multipartFormHander,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const data = await uploadToBucket(
        config.bucket_name,
        req.body.props.filename,
        req.body.props.file
      );

      const createdInstructor = await createInstructor({
        ...req.body.data,
        imageUrl: data.Location,
      });
      if (!createdInstructor) {
        setTimeout(async () => {
          await deleteFromBucket(config.bucket_name, req.body.data.resourceKey);
        }, 0);
        return errorResponse(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        );
      } else
        return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
          instructor: createdInstructor,
        });
    })
  );

  router.get(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const allInstructors = await getAllInstructors();

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        instructors: allInstructors,
      });
    })
  );

  router.get(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const instructor = await getInstructorById(req.params.id);
      if (!instructor)
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        instructor,
      });
    })
  );

  router.delete(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const instructor = await getInstructorById(req.params.id);

      setTimeout(async () => {
        await deleteFromBucket(config.bucket_name, instructor.resourceKey);
      }, 0);

      const instructorCount = await delteInstructorById(req.params.id);

      if (!instructorCount)
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK);
    })
  );

  router.put(
    "/",
    IsUserAuthorized,
    multipartFormHander,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      let data: { [k: string]: any } = {};
      if (req.body.props.filename) {
        data = await uploadToBucket(
          config.bucket_name,
          req.body.props.filename,
          req.body.props.file
        );
      }

      const instructor = await updateInstructorById(
        req.body.data.id as string,
        {
          ...req.body.data,
          ...(data.Location && { imageUrl: data.Location }),
        }
      );
      if (!instructor[0])
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        instructor,
      });
    })
  );
};
