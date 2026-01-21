import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const user = await UserServices.createUser(req.body);
   sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "User Is Created Successfully",
      data: user
   })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const result = await UserServices.getAllUsers();
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "All Users Retrived Successfully",
      data: result.data,
      meta: result.meta
   })
})

export const UserControllers = {
   createUser,
   getAllUsers
}