import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { BookingControllers } from "./booking.controller";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

router.post("/",
   checkAuth(...Object.values(Role)),
   validateRequest(createBookingZodSchema),
   BookingControllers.createBooking
);


export const BookingRoutes = router;