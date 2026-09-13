import { registerSchema } from "../validators/userValidator.js";


export const validateRegister = (req,res,next) => {
    const result = registerSchema.safeParse(req.body)

    if(!result.success){
        return res.status(400).json({
            message:"Validation failed",
            errors:result.error.issues.map((issue)=> issue.message)
        })
    }

    req.body = result.data

    next()
}