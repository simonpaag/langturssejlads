import { Router } from 'express';
import {
    getActiveCrewProfiles,
    getCrewProfileByUserId,
    getMyCrewProfile,
    upsertMyCrewProfile
} from '../controllers/crewProfileController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getActiveCrewProfiles);
router.get('/:userId', getCrewProfileByUserId);

// Protected routes
router.get('/me/profile', authenticateToken, getMyCrewProfile);
router.post('/me/profile', authenticateToken, upsertMyCrewProfile);
router.put('/me/profile', authenticateToken, upsertMyCrewProfile);

export default router;
