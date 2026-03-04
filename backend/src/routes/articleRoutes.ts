import { Router } from 'express';
import { createArticle, getPublicArticles, getArticleById, updateArticleStatus, getAllArticlesForAdmin } from '../controllers/articleController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// /api/articles
router.post('/', authenticateToken, createArticle);
router.get('/', getPublicArticles); // Public newsfeed
router.get('/:id', getArticleById); // Single public article
router.get('/admin', authenticateToken, getAllArticlesForAdmin); // Admin newsfeed
router.put('/:id/status', authenticateToken, updateArticleStatus);

export default router;
