import { Router } from 'express';
import {
  login,
  getProfile,
  updateProfile
} from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;

