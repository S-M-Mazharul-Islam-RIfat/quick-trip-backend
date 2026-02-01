/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
         return next(err)
      }

      if (!user) {
         return next(new AppError(401, info.message))
      }

      const userTokens = await createUserTokens(user)
      const { password: pass, ...rest } = user.toObject()
      setAuthCookie(res, userTokens)

      sendResponse(res, {
         success: true,
         statusCode: status.OK,
         message: "User Logged In Successfully",
         data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest
         },
      })
   })(req, res, next)
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

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const oldPassword = req.body.oldPassword;
   const newPassword = req.body.newPassword;
   const decodedToken = req.user;
   await AuthServices.changePassword(oldPassword, newPassword, decodedToken!);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Passwprd Is Reset Successfully",
      data: null
   })
})

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const decodedToken = req.user as JwtPayload;
   const { password } = req.body;

   await AuthServices.setPassword(decodedToken.userId, password);

   sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Password Changed Successfully",
      data: null,
   })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const decodedToken = req.user
   await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

   sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Password Changed Successfully",
      data: null,
   })
})

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const { email } = req.body;
   await AuthServices.forgotPassword(email);

   sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Email Sent Successfully",
      data: null,
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
   changePassword,
   setPassword,
   forgotPassword,
   resetPassword,
   googleCallback
}
