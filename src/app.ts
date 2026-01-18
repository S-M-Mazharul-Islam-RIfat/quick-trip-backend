
import express, { Request, Response } from "express";

const app = express()

app.get("/", (req: Request, res: Response) => {
   res.status(200).json({
      messsage: "Welcome To Tour Management System"
   })
})

export default app;