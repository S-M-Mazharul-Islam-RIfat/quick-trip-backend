import { NextFunction, Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const loginInfo = await AuthServices.credentialsLogin(req.body);

   setAuthCookie(res, loginInfo);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User LoggedIn Successfully",
      data: loginInfo
   })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const refreshToken = req.cookies.refreshToken;
   const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

   setAuthCookie(res, tokenInfo);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "New Access Token Is Retrived Successfully",
      data: tokenInfo
   })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
   })
   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
   })

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Is Logged Out Successfully",
      data: null
   })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const oldPassword = req.body.oldPassword;
   const newPassword = req.body.newPassword;
   const decodedToken = req.user;
   await AuthServices.resetPassword(oldPassword, newPassword, decodedToken!);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Passwprd Is Reset Successfully",
      data: null
   })
})

const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   let redirectTo = req.query.state ? req.query.state as string : "";

   if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
   }

   const user = req.user;
   if (!user) {
      throw new AppError(status.NOT_FOUND, "User Not Found");
   }

   const tokenInfo = await createUserTokens(user);
   setAuthCookie(res, tokenInfo);

   res.redirect(`${envVars.FRONTEND_URL}${redirectTo}`)
})

export const AuthControllers = {
   credentialLogin,
   getNewAccessToken,
   logout,
   resetPassword,
   googleCallback
}
