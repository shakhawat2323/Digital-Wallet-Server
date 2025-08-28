// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextFunction, Request, Response } from "express";

// import { verifyToken } from "../utils/jwt";
// import { envVars } from "../config/env";
// import { JwtPayload } from "jsonwebtoken";

// import httpStatus from "http-status-codes";

// import AppError from "../errorHelpers/AppError";
// import { IsActive } from "../modules/user/user.interface";
// import User from "../modules/user/user.model";
// export const checkAuth =
//   (...authRoles: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const accessToken = req.headers.authorization;

//       console.log(accessToken);
//       if (!accessToken) {
//         throw new AppError(403, "No Token Recived");
//       }
//       const verifyedToken = verifyToken(
//         accessToken,
//         envVars.JWT_ACCESS_SECRET
//       ) as JwtPayload;
//       console.log(verifyedToken);
//       const verifiedToken = verifyToken(
//         accessToken,
//         envVars.JWT_ACCESS_SECRET
//       ) as JwtPayload;

//       const isUserExist = await User.findOne({ email: verifiedToken.email });
//       console.log(isUserExist);

//       if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
//       }
//       if (
//         isUserExist.isActive === IsActive.BLOCKED ||
//         isUserExist.isActive === IsActive.INACTIVE
//       ) {
//         throw new AppError(
//           httpStatus.BAD_REQUEST,
//           `User is ${isUserExist.isActive} `
//         );
//       }
//       if (isUserExist.isDeleted) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
//       }

//       if (!authRoles.includes(verifyedToken.role)) {
//         throw new AppError(
//           403,
//           `You are not a not authorization ${verifyedToken}`
//         );
//       }

//       req.user = {
//         _id: verifiedToken._id,
//         email: verifiedToken.email,
//         role: verifiedToken.role,
//       };

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };

// sencend code
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      const decoded = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;
      // const isUserExist = await User.findOne({ email: decoded.email });

      const isUserExist = await User.findOne({ email: decoded.email }).populate(
        "wallets"
      );

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (!authRoles.includes(decoded.role)) {
        throw new AppError(403, `You are not authorized as ${decoded.role}`);
      }
      // ✅ এখন wallet থেকে চেক করি user এর কোনো BLOCKED wallet আছে কিনা
      const blockedWallet = await Wallet.findOne({
        user: isUserExist._id,
        status: "BLOCKED",
      });

      if (blockedWallet) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Your wallet is BLOCKED, no transactions allowed"
        );
      }

      req.user = {
        _id: decoded._id,
        email: decoded.email,
        role: decoded.role,
        wallet: isUserExist._id, // ধরলাম প্রথম ওয়ালেট
      };

      next();
    } catch (error) {
      next(error);
    }
  };
// thered code
