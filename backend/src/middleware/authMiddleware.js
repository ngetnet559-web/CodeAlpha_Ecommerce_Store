import jwt from "jsonwebtoken";
import env from "../config/env.js";

const secret_key = env.jwtSecret;

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secret_key);

    req.user = decoded;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message = "Invalid or expired token";
    }

    next(error);
  }
};