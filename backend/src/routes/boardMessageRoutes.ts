import { Router } from 'express';
import { getMessages as getBoardMessages, createMessage, deleteMessage } from '../controllers/boardMessageController';
import { authenticateToken, optionalAuth, requireActiveUser } from '../middlewares/authMiddleware';

const router = Router();

// Hent opslag for en specifik post (public, optionally authenticated for read state)
router.get('/boats/:id/messages', optionalAuth as any, getBoardMessages);

// Nyt opslag på en båds opslagstavle
router.post('/boats/:id/messages', authenticateToken, requireActiveUser, createMessage);

// DELETE /api/messages/:msgId
router.delete('/messages/:msgId', authenticateToken, deleteMessage);

export default router;
