import { Router } from 'express';
import { createBoat, getBoats, getBoatBySlug, updateBoat, updateBoardStatus } from '../controllers/boatController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createBoat);
router.get('/', getBoats); // Public endpoint
router.get('/:slug', getBoatBySlug); // Single public boat profile
router.put('/:id', authenticateToken, updateBoat); // Update boat profile
router.put('/:id/board-status', authenticateToken, updateBoardStatus); // Toggle Noticeboard

export default router;
