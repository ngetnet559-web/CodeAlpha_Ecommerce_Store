import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"

const secret_key = process.env.JWT_SECRET

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

export const loginUser = async (userData) => {
    const user = await prisma.user.findUnique({
        where:{ email: userData.email}
    })

    if(!user){
        const error = new Error("Invalid email or password")
        error.statusCode = 401

        throw error
    }

    const passwordMatch  = await bcrypt.compare(userData.password, user.password)

    if(!passwordMatch){
        const error = new Error ("Invalid email or password")
        error.statusCode = 401
        throw error
    }

    const generateToken = (user) =>{
        const payload = {
            id:user.id
        }

        return jwt.sign(payload,secret_key, {expiresIn: '1h'})
    }
     
    const token = generateToken(user)

    return {user,token}
}