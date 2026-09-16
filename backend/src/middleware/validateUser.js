import { registerSchema,loginSchema } from "../validators/userValidator.js";


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

export const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;
  next();
};