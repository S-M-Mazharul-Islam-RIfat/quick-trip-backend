import { Request, Response } from "express";
import status from "http-status";

const notFound = (req: Request, res: Response) => {
   res.status(status.NOT_FOUND).json({
      succes: false,
      message: "Route Not Found"
   })
}

export default notFound;