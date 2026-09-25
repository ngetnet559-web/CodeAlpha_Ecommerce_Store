import e from "express";

import { registerUser, login } from "../controllers/userController.js";

import { validateRegister, validateLogin } from "../middleware/validateUser.js";

import authRateLimiter from "../middleware/authRateLimiter.js";

const router = e.Router();

router.post("/register", authRateLimiter, validateRegister, registerUser);

router.post("/login", authRateLimiter, validateLogin, login);

export default router;
