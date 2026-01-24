import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
   const { email, password } = payload;

   const isUserExist = await User.findOne({ email });
   if (!isUserExist) {
      throw new AppError(status.BAD_REQUEST, "Email does not exist");
   }

   const isPasswordMatched = await bcrypt.compare(password!, isUserExist.password);
   if (!isPasswordMatched) {
      throw new AppError(status.BAD_REQUEST, "Incorrect Password");
   }

   const jwtPayload = {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role
   }

   const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
   return {
      accessToken
   }
}

export const AuthServices = {
   credentialsLogin
}