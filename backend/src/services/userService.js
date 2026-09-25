import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

const secret_key = env.jwtSecret;

export const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });
};

export const loginUser = async (userData) => {
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;

    throw error;
  }

  const passwordMatch = await bcrypt.compare(userData.password, user.password);

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const generateToken = (user) => {
    const payload = {
      id: user.id,
      role: user.role,
    };

    return jwt.sign(payload, secret_key, {
      expiresIn: "1h",
    });
  };

  const token = generateToken(user);

  return { user, token };
};
