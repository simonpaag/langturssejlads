import { Router } from 'express';
import { register, login, getMe, updateInterests, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/interests', authenticateToken, updateInterests);
router.put('/profile', authenticateToken, updateProfile);

export default router;
