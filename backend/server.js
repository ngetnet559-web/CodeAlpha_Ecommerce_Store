import e from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import env from "./src/config/env.js";

import { errorMiddleware } from "./src/middleware/errorMiddleware.js";

const app = e();
const port = env.port;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);

app.use(e.json());
app.use(e.urlencoded({ extended: false }));

app.use("/api", apiLimiter);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
