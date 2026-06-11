/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { authServices } from "./auth.service";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInInfo = await authServices.credentialsLogin(req.body);
    setAuthCookie(res, loggedInInfo);

    sendResponse(res, {
      success: true,
      message: "User Logged in successfully",
      data: loggedInInfo,
      statusCode: httpStatus.OK,
    });
  },
);
const getNewRefreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const tokenInfo = await authServices.getNewRefreshToken(
      refreshToken as string,
    );
    setAuthCookie(res, {
      accessToken: tokenInfo.accessToken,
      refreshToken: refreshToken,
    });

    sendResponse(res, {
      success: true,
      message: "User new access token retrieve successfully",
      data: tokenInfo,
      statusCode: httpStatus.OK,
    });
  },
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      message: "User logged out successfully",
      data: null,
      statusCode: httpStatus.OK,
    });
  },
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    await authServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload,
    );

    sendResponse(res, {
      success: true,
      message: "Password reset successfully",
      data: null,
      statusCode: httpStatus.OK,
    });
  },
);

export const authControllers = {
  credentialsLogin,
  getNewRefreshToken,
  logout,
  resetPassword,
};
