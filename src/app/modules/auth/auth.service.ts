/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import { createUserTokens } from "../../utils/userToken";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//   }
//   const userToken = createUserTokens(isUserExist);

//   // delete isUserExist.password;
//   const { password: pass, ...rest } = isUserExist.toObject();
//   return {
//     accessToken: userToken.accessToken,

//     refreshToken: userToken.refreshToken,
//     user: rest,
//   };
// };
const credentialsLogin = async (Payload: Partial<IUser>) => {
  const { email, password } = Payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email dose Not exist");
  }
  const ispasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!ispasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const userToken = createUserTokens(isUserExist);

  // delete isUserExist.password;
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userToken.accessToken,

    refreshToken: userToken.refreshToken,
    user: rest,
  };
};
export const AuthServices = {
  credentialsLogin,
};
