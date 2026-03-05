import { Router } from 'express';
import { submitContact, submitBoatContactMessage, getMessagesForBoat, markMessageAsRead } from '../controllers/contactController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', submitContact);
router.post('/boat', submitBoatContactMessage);
router.get('/boat/:boatId', authenticateToken, getMessagesForBoat);
router.put('/boat/:id/read', authenticateToken, markMessageAsRead);

export default router;
