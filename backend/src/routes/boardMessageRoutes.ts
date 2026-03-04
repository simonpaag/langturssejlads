import { Router } from 'express';
import { getMessages, createMessage, deleteMessage } from '../controllers/boardMessageController';
import { authenticateToken, optionalAuth } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/boats/:id/messages
// Vi bruger optionalAuth, så gæster (uden token) også kan hente beskeder (hvis tavlen er offentlig)
router.get('/boats/:id/messages', optionalAuth, getMessages);

// POST /api/boats/:id/messages
router.post('/boats/:id/messages', authenticateToken, createMessage);

// DELETE /api/messages/:msgId
router.delete('/messages/:msgId', authenticateToken, deleteMessage);

export default router;
