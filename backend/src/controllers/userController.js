import { createUser } from "../services/userService.js";
import { loginUser } from "../services/userService.js";

export const registerUser = async (req,res,next) => {
    try {
        const user = await createUser(req.body)

        const {password , ...userWithoutPassword} = user

        res.status(201).json(userWithoutPassword)
    } catch (error) {
       next(error) 
    }
}

export const login = async (req,res,next)  => {
    try {
        const {user, token} =  await loginUser(req.body)
        const {password, ...userWithoutPassword} =user

        res.status(200).json({user:userWithoutPassword, token:token})
    } catch (error) {
       next(error) 
    }
}