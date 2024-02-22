"use client";

import express, { NextFunction, Request, Response } from "express";
import { ExpressType } from "../types";
import { IsUserAuthorized, errorHandler } from "../middleware";
import {
  createCourse,
  deleteCourseById,
  getCourseById,
  getCourses,
  updateCourseById,
} from "../service/course";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { errorResponse, successResponse } from "../lib";
import config from "../config";
import { deleteFromBucket, getSignedUrl } from "../service/s3";

export default (app: ExpressType) => {
  const router = express.Router();

  app.use("/api/course", router);

  router.get(
    "/signed-url",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { filename, contentType, type } = req.query;

      const folder = type === "video" ? "trailers" : "images";
      const key = `${folder}/${filename}`;

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
      const course = await createCourse(req.body);
      if (!course)
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST
        );

      return successResponse(res, StatusCodes.CREATED, ReasonPhrases.CREATED);
    })
  );

  router.get(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const courses = await getCourses();

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        courses,
      });
    })
  );

  router.get(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const course = await getCourseById(req.params.id);
      if (!course)
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        course,
      });
    })
  );

  router.put(
    "/",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const existingCourse = await getCourseById(req.body.id);
      const updatedCourse = await updateCourseById(req.body.id, req.body);

      if (!updatedCourse[0])
        return errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST
        );

      if (
        existingCourse &&
        existingCourse.videoTrailerUrl !== req.body.videoTrailerUrl
      ) {
        const name =
          existingCourse.videoTrailerUrl.split("/")[
            existingCourse.videoTrailerUrl.split("/").length - 1
          ];
        const key = `trailers/${name}`;

        setTimeout(async () => {
          await deleteFromBucket(config.bucket_name, key);
        }, 0);
      }

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, {
        course: updatedCourse,
      });
    })
  );

  router.delete(
    "/:id",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const existingCourse = await getCourseById(req.params.id);
      const course = await deleteCourseById(req.params.id);
      if (!course)
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );

      if (existingCourse) {
        const name =
          existingCourse.videoTrailerUrl.split("/")[
            existingCourse.videoTrailerUrl.split("/").length - 1
          ];
        const thumbnail =
          existingCourse.thumbnail.split("/")[
            existingCourse.thumbnail.split("/").length - 1
          ];
        const key = `trailers/${name}`;
        const thumbnailKey = `images/${thumbnail}`;

        setTimeout(async () => {
          await deleteFromBucket(config.bucket_name, key);
          await deleteFromBucket(config.bucket_name, thumbnailKey);
        }, 0);
      }

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK);
    })
  );
};
