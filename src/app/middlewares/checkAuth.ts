import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { evnVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError("No token receieved", 403);
      }
      const verifiedToken = verifyToken(
        accessToken,
        evnVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;
      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError("User not found", httpStatus.BAD_REQUEST);
      }
      if (isUserExist.isActive === (IsActive.BLOCKED || IsActive.INACTIVE)) {
        throw new AppError(
          "User is blocked or InActive",
          httpStatus.BAD_REQUEST,
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError("User is deleted", httpStatus.BAD_REQUEST);
      }
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError("You are not permitted to view this route!", 403);
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
