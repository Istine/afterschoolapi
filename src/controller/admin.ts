import express, { Request, Response, NextFunction } from "express";
import { ExpressType } from "../types";
import {
  IsUserAuthorized,
  errorHandler,
  validateLoginData,
} from "../middleware";
import {
  authenticateUser,
  createAccount,
  getAdminById,
  login,
  logout,
  saveAccessToken,
  updateAccount,
} from "../service/admin";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { createAccessToken, errorResponse, successResponse } from "../lib";

export default (app: ExpressType) => {
  const router = express.Router();

  app.use("/api", router);

  router.get(
    "/admin",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const admin = await getAdminById(
        (req as Request & { admin: string }).admin
      );
      if (!admin) {
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }

      return successResponse(res, StatusCodes.OK, ReasonPhrases.OK, { admin });
    })
  );

  router.post(
    "/admin",
    IsUserAuthorized,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const admin = await updateAccount(req.body);
      if (!admin[0]) {
        return errorResponse(
          res,
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }

      const jwtPayload = { email: req.body.email };

      const token: string = await createAccessToken(jwtPayload);

      if (!token) throw new Error("error creating user token");

      const storedToken = await saveAccessToken(token, req.body.id);

      return res
        .cookie("jwt", storedToken.token, {
          httpOnly: true, // Prevent JavaScript from accessing the token
          secure: false, // Requires HTTPS
          maxAge: 3600000, // Cookie expires in 1 hour
          sameSite: "strict", // Helps protect against cross-site request forgery (CSRF) attacks
        })
        .status(StatusCodes.OK)
        .json({ message: ReasonPhrases.OK, admin });
    })
  );

  router.post(
    "/create",
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const user = await createAccount(req.body);
      if (!user)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: ReasonPhrases.NOT_FOUND });

      return res
        .status(StatusCodes.CREATED)
        .json({ message: ReasonPhrases.CREATED });
    })
  );

  router.post(
    "/login",
    validateLoginData,
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      const user = await login(req.body);

      if (!user)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: ReasonPhrases.NOT_FOUND });

      const jwtPayload = { email: user.email };

      const token: string = await createAccessToken(jwtPayload);

      if (!token) throw new Error("error creating user token");

      const storedToken = await saveAccessToken(token, user.id);

      return res
        .cookie("jwt", storedToken.token, {
          httpOnly: true, // Prevent JavaScript from accessing the token
          secure: false, // Requires HTTPS
          maxAge: 3600000, // Cookie expires in 1 hour
          sameSite: "strict", // Helps protect against cross-site request forgery (CSRF) attacks
        })
        .status(StatusCodes.OK)
        .json({ message: ReasonPhrases.OK });
    })
  );

  router.get(
    "/logout",
    errorHandler(async (req: Request, res: Response, next: NextFunction) => {
      let token;
      token = req.cookies.jwt;
      if (!token) {
        token = req.headers.authorization?.split(" ")[1].trim();
      }
      const user = await authenticateUser(token);
      await logout(token, user.id);
      res.clearCookie("jwt");
      return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    })
  );
};
