import { NextFunction, Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const loginInfo = await AuthServices.credentialsLogin(req.body);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User LoggedIn Successfully",
      data: loginInfo
   })
})


export const AuthControllers = {
   credentialLogin
}
