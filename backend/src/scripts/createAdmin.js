import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

const createAdmin = async () => {
  const email = "admin@shopstore.com";
  const password = "Admin123456";

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        role: "ADMIN",
      },
    });

    console.log("Existing user promoted to ADMIN.");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: "ShopStore Admin",
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin account created.");
  }

  await prisma.$disconnect();
};

createAdmin().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});