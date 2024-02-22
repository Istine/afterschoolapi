import { NextFunction, Request, Response } from "express";
import { validateData } from "../lib";
import { authenticateUser, isAuthorizedUser } from "../service/admin";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const validateLoginData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await validateData(req.body);
    next();
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: (error as { errors: Array<string> }).errors });
  }
};

export const IsUserAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let jwt;
    jwt = req.cookies.jwt;
    if (!jwt) {
      jwt = req.headers.authorization?.split(" ")[1].trim();
    }

    const user = await authenticateUser(jwt);
    if (!user) {
      res.clearCookie("jwt");

      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(ReasonPhrases.BAD_REQUEST);
    }

    const token = await isAuthorizedUser(jwt, user.id);
    if (!token) {
      res.clearCookie("jwt");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);
    }

    (req as Request & { admin: string }).admin = user.id;

    return next();
  } catch (error) {
    next(error);
  }
};

export const validatePaginationConstraints = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page as unknown as number;

    const limit = req.query.limit as unknown as number;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid page or limit parameters" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const errorHandler =
  (handler: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
