import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import status from "http-status";
import { Request, Response } from "express";

const createBooking = catchAsync(async (req: Request, res: Response) => {
   const decodeToken = req.user as JwtPayload
   const booking = await BookingServices.createBooking(req.body, decodeToken.userId);
   sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Booking created successfully",
      data: booking,
   });
});


export const BookingControllers = {
   createBooking
}
