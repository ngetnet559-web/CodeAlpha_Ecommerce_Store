import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js"

export const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    return await prisma.user.create({
        data:{
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        }
    })
}