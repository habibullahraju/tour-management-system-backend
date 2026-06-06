import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

//create user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  if (!email) {
    throw new AppError("Email is required", httpStatus.BAD_REQUEST);
  }
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError("User already exist", httpStatus.BAD_REQUEST);
  }
  const hashPassword = await bcryptjs.hash(password as string, 10);
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

export const UserServices = {
  createUser,
  getAllUsers,
};
