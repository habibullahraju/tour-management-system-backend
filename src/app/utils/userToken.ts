import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { evnVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    evnVars.JWT_ACCESS_SECRET,
    evnVars.JWT_EXPIRES_IN,
  );
  const refreshToken = generateToken(
    jwtPayload,
    evnVars.JWT_REFRESH_SECRET,
    evnVars.JWT_REFRESH_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string,
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    evnVars.JWT_REFRESH_SECRET,
  ) as JwtPayload;
  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError("User not found", httpStatus.BAD_REQUEST);
  }
  if (isUserExist.isActive === (IsActive.BLOCKED || IsActive.INACTIVE)) {
    throw new AppError("User is blocked or InActive", httpStatus.BAD_REQUEST);
  }
  if (isUserExist.isDeleted) {
    throw new AppError("User is deleted", httpStatus.BAD_REQUEST);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    evnVars.JWT_ACCESS_SECRET,
    evnVars.JWT_EXPIRES_IN,
  );

  return accessToken;
};
