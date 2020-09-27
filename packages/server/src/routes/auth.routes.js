import { Router } from 'express';
import {
  forgotPassword,
  getCurrentUser,
  getRoles,
  login,
  logout,
  registerUser,
  resetPassword,
  updateDetails,
  updatePassword
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.get('/logout', protect, logout);
router.get('/user', protect, getCurrentUser);
router.get('/getRoles', getRoles);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.put('/resetPassword/:resetToken', resetPassword);

export default router;
