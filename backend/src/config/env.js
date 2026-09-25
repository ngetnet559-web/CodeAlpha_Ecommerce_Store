const requiredEnvVariables = [
  "DATABASE_URL",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl:
    process.env.FRONTEND_URL || "http://localhost:5173",
};