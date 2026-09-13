import { createUser } from "../services/userService.js";

export const registerUser = async (req,res,next) => {
    try {
        const user = await createUser(req.body)

        const {password , ...userWithoutPassword} = user

        res.status(201).json(userWithoutPassword)
    } catch (error) {
       next(error) 
    }
}