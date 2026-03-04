import { Router } from 'express';
import { createBoat, getBoats, getBoatBySlug } from '../controllers/boatController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createBoat);
router.get('/', getBoats); // Public endpoint
router.get('/:slug', getBoatBySlug); // Single public boat profile

export default router;
