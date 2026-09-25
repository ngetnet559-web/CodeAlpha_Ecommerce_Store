export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

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

  if (err.name === "MulterError") {
    return res.status(400).json({
      message: "File upload failed",
    });
  }

  const statusCode = err.statusCode || 500;

  const message =
    statusCode >= 500
      ? "Internal server error"
      : err.message || "Request failed";

  res.status(statusCode).json({
    message,
  });
};
