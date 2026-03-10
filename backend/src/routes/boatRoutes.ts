import { Router } from 'express';
import { createBoat, getBoats, getBoatBySlug, updateBoat, updateBoardStatus, claimBoatRequest } from '../controllers/boatController';
import { authenticateToken, requireActiveUser } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, requireActiveUser, createBoat);
router.get('/', getBoats); // Public liste over både (søgbar)
router.get('/:slug', getBoatBySlug); // Public bådprofil
router.put('/:id', authenticateToken, requireActiveUser, updateBoat); // Update boat profile
router.put('/:id/board-status', authenticateToken, updateBoardStatus); // Toggle Noticeboard
router.post('/:id/claim-request', claimBoatRequest); // Request claiming an ownerless boat

export default router;
