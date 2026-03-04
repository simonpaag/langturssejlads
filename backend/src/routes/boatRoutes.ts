import { Router } from 'express';
import { createBoat, getBoats } from '../controllers/boatController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createBoat);
router.get('/', getBoats); // Public endpoint

export default router;
