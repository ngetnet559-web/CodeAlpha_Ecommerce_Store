import e from 'express'
import { registerUser } from '../controllers/userController.js'
import { validateRegister } from '../middleware/validateUser.js'


const router = e.Router()

router.post('/register',validateRegister, registerUser)

export default router