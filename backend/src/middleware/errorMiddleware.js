export const errorMiddleware = (err, req, res, next) => {
  if (err.code === "P2002") {
    return res.status(409).json({
      message: "A record with this value already exists",
    });
  }

  if (err.code === "P2003") {
    return res.status(409).json({
      message:
        "This record cannot be deleted because it is referenced by another record",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Record not found",
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
};
