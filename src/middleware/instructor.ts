import { Request, Response, NextFunction } from "express";
import { errorHandler } from ".";
import { instructorKeyType, instructorType } from "../types";
import busboy from "busboy";

export const multipartFormHander = errorHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const fields = {} as instructorType;

    const IMAGES_FOLDER = "images/";

    const uploadProps = {} as { filename: string; file: any };

    const bb = busboy({
      headers: req.headers,
    });

    bb.on("field", (name: instructorKeyType, value, info) => {
      fields[name] = value;
    });

    bb.on("file", async (name, file, info) => {
      const { filename } = info;
      uploadProps.filename = IMAGES_FOLDER + filename;
      fields.resourceKey = IMAGES_FOLDER + filename;
      uploadProps.file = file;
    })
      .on("error", (error) => {
        console.error((error as Error).message);
      })
      .end((req as { [key: string]: any }).rawBody);

    req.body = { data: { ...req.body, ...fields }, props: { ...uploadProps } };
    next();
  }
);
