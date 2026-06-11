import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { evnVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  if (!email) {
    throw new AppError("Email is required", httpStatus.BAD_REQUEST);
  }
  if (!password) {
    throw new AppError("Password is required", httpStatus.BAD_REQUEST);
  }
  const isUserExist = await User.findOne({ email }).select("+password");
  if (!isUserExist) {
    throw new AppError("email does not exist!", httpStatus.BAD_REQUEST);
  }
  const isPasswordMatched = await bcryptjs.compare(
    password,
    isUserExist.password as string,
  );
  if (!isUserExist?.password) {
    throw new AppError("Password not found", httpStatus.INTERNAL_SERVER_ERROR);
  }
  if (!isPasswordMatched) {
    throw new AppError("incorrect password!", httpStatus.BAD_REQUEST);
  }

  const userTokens = createUserToken(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...userData } = isUserExist.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userData,
  };
};
const getNewRefreshToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await User.findById(decodedToken.userId).select("+password");
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }
  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user.password as string,
  );
  if (!isOldPasswordMatched) {
    throw new AppError("Old password is incorrect", httpStatus.BAD_REQUEST);
  }
  const hashedNewPassword = await bcryptjs.hash(
    newPassword,
    Number(evnVars.BCRYPT_SALD_ROUND),
  );
  user.password = hashedNewPassword;
  await user.save();
  return true;
};

export const authServices = {
  credentialsLogin,
  getNewRefreshToken,
  resetPassword,
};
