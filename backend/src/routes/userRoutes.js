import e from 'express'
import { login, registerUser } from '../controllers/userController.js'
import { validateRegister } from '../middleware/validateUser.js'

const router = e.Router()

router.post('/register',validateRegister, registerUser).post('/login',login)

export default router