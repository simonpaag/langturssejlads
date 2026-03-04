import { Router } from 'express';
import { createBoat, getBoats, getBoatById } from '../controllers/boatController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createBoat);
router.get('/', getBoats); // Public endpoint
router.get('/:id', getBoatById); // Single public boat profile

export default router;
