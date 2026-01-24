import { Request, Response } from "express";
import status from "http-status";

const notFound = (req: Request, res: Response) => {
   res.status(status.NOT_FOUND).json({
<<<<<<< HEAD
      succes: false,
=======
      success: false,
>>>>>>> part-2
      message: "Route Not Found"
   })
}

export default notFound;