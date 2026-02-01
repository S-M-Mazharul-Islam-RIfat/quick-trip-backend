import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const user = await UserServices.createUser(req.body);
   sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "User Is Created Successfully",
      data: user
   })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const userId = req.params.id;
   const verifiedToken = req.user;
   const payload = req.body;
   const user = await UserServices.updateUser(userId as string, payload, verifiedToken!);
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

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const id = req.params.id;
   const result = await UserServices.getSingleUser(id as string);
   sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "User Retrieved Successfully",
      data: result.data
   })
})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const decodedToken = req.user as JwtPayload;
   const result = await UserServices.getMe(decodedToken.userId);

   sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Your profile Retrieved Successfully",
      data: result.data
   })
})

export const UserControllers = {
   createUser,
   getAllUsers,
   updateUser,
   getSingleUser,
   getMe
}

