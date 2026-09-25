export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    const error = new Error("Admin access required");
    error.statusCode = 403;
    return next(error);
  }

  next();
};