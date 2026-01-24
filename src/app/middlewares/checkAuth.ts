import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
   try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
         throw new AppError(status.FORBIDDEN, "No Toke Received");
      }

      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

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