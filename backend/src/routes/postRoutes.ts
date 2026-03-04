import { Router } from 'express';
import { createPost, getPublicPosts, getPostBySlug, updatePostStatus, getAllPostsForAdmin } from '../controllers/postController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// /api/posts
router.post('/', authenticateToken, createPost);
router.get('/', getPublicPosts); // Public newsfeed
router.get('/:slug', getPostBySlug); // Single public post
router.get('/admin', authenticateToken, getAllPostsForAdmin); // Admin newsfeed
router.put('/:id/status', authenticateToken, updatePostStatus);

export default router;
