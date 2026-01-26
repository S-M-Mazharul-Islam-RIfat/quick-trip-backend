import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
   try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
         throw new AppError(status.FORBIDDEN, "No Token Received");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email })

      if (!isUserExist) {
         throw new AppError(status.BAD_REQUEST, "User does not exist")
      }
      if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
         throw new AppError(status.BAD_REQUEST, `User is ${isUserExist.isActive}`)
      }
      if (isUserExist.isDeleted) {
         throw new AppError(status.BAD_REQUEST, "User is deleted")
      }
      if (!authRoles.includes(verifiedToken.role)) {
         throw new AppError(status.UNAUTHORIZED, "You are not authorized");
      }

      req.user = verifiedToken;

      next();
   }
   catch (error) {
      next(error);
   }
}

export default checkAuth;