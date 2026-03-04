import { Router } from 'express';
import { addCrewMember } from '../controllers/crewController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// /api/crew
router.post('/add', authenticateToken, addCrewMember);

export default router;
