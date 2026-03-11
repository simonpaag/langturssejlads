import { Router } from 'express';
import { submitContact, submitBoatContactMessage, getMessagesForBoat, markMessageAsRead, getUnreadMessageCount } from '../controllers/contactController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', submitContact);
router.post('/boat', submitBoatContactMessage);
router.get('/boat/:boatId', authenticateToken, getMessagesForBoat);
router.get('/boat/:boatId/unread-count', authenticateToken, getUnreadMessageCount);
router.put('/boat/:id/read', authenticateToken, markMessageAsRead);

export default router;
