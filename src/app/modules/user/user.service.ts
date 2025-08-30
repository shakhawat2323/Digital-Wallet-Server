import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, role, ...rest } = payload;

  // Check if user already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // Auth provider info
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || "USER",
    status: "APPROVED",
    auths: [authProvider],
    ...rest,
  });

  const walletType = user.role === Role.AGENT ? "BUSINESS" : "PERSONAL";

  // Create wallet automatically with initial balance TK50
  const wallet = await Wallet.create({
    user: user._id,
    balance: 50, // initial balance
    currency: "BDT",
    type: walletType,
    status: "ACTIVE",
    isActive: true,
  });

  // Link wallet to user
  (user.wallets as JwtPayload).push(wallet._id);
  await user.save();

  // return populated user (with wallet info)
  const populatedUser = await User.findById(user._id).populate("wallets");

  return populatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // 🔐 Role change validation
  if (payload.role) {
    // Only ADMIN can assign/change role
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change roles"
      );
    }
    // Prevent non-admin from assigning ADMIN role
    if (payload.role === Role.ADMIN && decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only ADMIN can assign ADMIN role"
      );
    }
  }

  // 🔐 Password hashing
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
