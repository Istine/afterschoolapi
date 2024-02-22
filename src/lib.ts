import { object, string, InferType, number } from "yup";
import bcrypt from "bcrypt";
import { Response } from "express";
import jsonwebtoken from "jsonwebtoken";

import config from "./config";
import db from "./entity";
import { Transaction } from "sequelize";
import { courseType, lessonType } from "./types";

const LoginSchema = object({
  email: string().required().email(),
  password: string()
    .required()
    .min(6, "must be at least 6 characters long")
    .max(10, "'must be at most 10 characters long'"),
});

const PaginationSchema = object({
  page: number().required(),
  limit: number().required(),
});

type User = InferType<typeof LoginSchema>;

export const validateData = async (body: User) => {
  const isValid = await LoginSchema.validate(body, { strict: true });
  return isValid;
};

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, config.salt_rounds);
};

export const comparePasswords = async (plainPassword: string, hash: string) => {
  return await bcrypt.compare(plainPassword, hash);
};

export const createAccessToken = async (payload: any) => {
  const token: string = jsonwebtoken.sign(payload, config.jwt_secret, {
    expiresIn: 60 * 60 * 24, // 24 hours
  });
  return token;
};

export const decodeAccessToken = (token: string) => {
  const decoded = jsonwebtoken.verify(token, config.jwt_secret);
  return decoded;
};

export const errorResponse = (res: Response, code: number, message: string) => {
  res.status(code).send(message);
};

export const successResponse = (
  res: Response,
  code: number,
  message: string,
  data: any = {}
) => {
  res.status(code).json({ message, ...data });
};

export const withTransaction = async (callback: any) => {
  const result = await db.sequelize.transaction(
    async (transaction: Transaction) => {
      try {
        return await callback(transaction);
      } catch (error) {
        throw error;
      }
    }
  );

  return result;
};

export const transformLessonData = (lessons: Array<lessonType>) => {
  return lessons.map((lesson) => ({
    ...lesson,
    videoUrl:
      "https://e-learning-app-profile-pictures-v1.s3.us-east-2.amazonaws.com/" +
      lesson.videoUrl,
  }));
};

export const transformCourseData = (course: courseType) => {
  return {
    ...course,
    videoTrailerUrl:
      "https://e-learning-app-profile-pictures-v1.s3.us-east-2.amazonaws.com/" +
      course.videoTrailerUrl,
    thumbnail:
      "https://e-learning-app-profile-pictures-v1.s3.us-east-2.amazonaws.com/" +
      course.thumbnail,
  };
};
