import { Router } from 'express';
import { createArticle, getPublicArticles, updateArticleStatus } from '../controllers/articleController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// /api/articles
router.post('/', authenticateToken, createArticle);
router.get('/', getPublicArticles); // Public newsfeed
router.put('/:id/status', authenticateToken, updateArticleStatus);

export default router;
