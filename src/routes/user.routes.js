import express from 'express'
import auth from '../utils/auth.js'
import { isAdmin } from '../middlewares/roleAuth.js'
import { validateResource } from '../middlewares/validator.middleware.js'
import { signUpSchema, signInSchema, updateUserSchema } from '../validators/user.validator.js'

import {
  signin,
  signup,
  getUser,
  getUsers,
  acceptTerms,
  authValidation,
  toggleUserStatus,
  updateUserDetails
} from '../controllers/user.controller.js'

const router = express.Router()

// --- PUBLIC ROUTES ---
router.post('/signin', validateResource(signInSchema), signin)

// --- PROTECTED ROUTES ---
router.post('/signup', [auth, isAdmin, validateResource(signUpSchema)], signup)
router.get('/me', auth, getUser)
router.patch('/accept-terms', auth, acceptTerms);
router.get('/validate', auth, authValidation)
router.get('/all', [auth, isAdmin], getUsers)
router.patch('/toggle-status/:id', [auth, isAdmin], toggleUserStatus);
router.patch('/:id', [auth, isAdmin, validateResource(updateUserSchema)], updateUserDetails);

export default router