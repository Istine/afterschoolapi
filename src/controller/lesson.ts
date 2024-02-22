import express, { Request, Response, NextFunction } from "express";
import { ExpressType } from "../types";
import { IsUserAuthorized, errorHandler } from "../middleware";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { errorResponse, successResponse, transformLessonData } from "../lib";
import {
  createLessons,
  deleteLessonById,
  getAllLessons,
  getLessonById,
  updateLessonById,
} from "../service/lesson";
import { deleteFromBucket, getSignedUrl } from "../service/s3";
import config from "../config";

export default (app: ExpressType) => {
  const router = express.Router();

  app.use("/api/lesson", router);

  router.get(
    "/signed-url",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { filename, contentType } = req.query;

      const key = `lessons/${filename}`;

      const params = {
        Bucket: config.bucket_name,
        Key: key,
        ContentType: contentType as string,
        Expires: 60 * 50,
      };
      const signedUrl = getSignedUrl(params);
      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        signedUrl,
        key,
      });
    })
  );

  router.post(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const response = await createLessons(transformLessonData(req.body));

      if (!response.length) {
        return errorResponse(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        );
      }

      return successResponse(res, StatusCodes.CREATED, ReasonPhrases.CREATED);
    })
  );

  router.get(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const lessons = await getAllLessons();
      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        lessons,
      });
    })
  );

  router.get(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const lesson = await getLessonById(req.params.id);
      if (!lesson)
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        lesson,
      });
    })
  );

  router.put(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const body = transformLessonData([req.body]);
      const lessonInStore = await getLessonById(req.body.id);

      if (lessonInStore) {
        const key = `lessons/${lessonInStore.title}`;
        setTimeout(async () => {
          await deleteFromBucket(config.bucket_name, key);
        }, 0);
      }
      const lesson = await updateLessonById(req.body.id, body[0]);
      if (!lesson[0]) {
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        lesson,
      });
    })
  );

  router.delete(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const lesson = await getLessonById(req.params.id);
      const deletedLesson = await deleteLessonById(req.params.id);
      if (!deletedLesson)
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );

      if (lesson) {
        const key = `lessons/${lesson.title}`;
        setTimeout(async () => {
          await deleteFromBucket(config.bucket_name, key);
        }, 0);
      }

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK);
    })
  );
};
