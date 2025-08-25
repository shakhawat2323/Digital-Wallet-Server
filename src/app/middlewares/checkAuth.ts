import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

import httpStatus from "http-status-codes";

import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      console.log(accessToken);
      if (!accessToken) {
        throw new AppError(403, "No Token Recived");
      }
      const verifyedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive} `
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifyedToken.role)) {
        console.log(verifyedToken);
        throw new AppError(
          403,
          `You are not a not authorization ${verifyedToken}`
        );
      }

      req.user = verifyedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
