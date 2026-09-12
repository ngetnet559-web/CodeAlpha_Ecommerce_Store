export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  res.status(500).json({ message: "Something went wrong" });
};
