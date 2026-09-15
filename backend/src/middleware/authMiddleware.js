import jwt from "jsonwebtoken";

const secret_key = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secret_key);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({message: "Invalid or expired token"})
  }
};
