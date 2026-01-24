import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.get("/login", AuthControllers.credentialLogin);

export const AuthRoutes = router;