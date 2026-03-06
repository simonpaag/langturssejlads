import { Router } from 'express';
import { createPost, getPublicPosts, getPostBySlug, updatePostStatus, getAllPostsForAdmin, getPostsByBoatId, togglePostStatus, toggleVote, updatePost, getActiveAds } from '../controllers/postController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// /api/posts
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.get('/', getPublicPosts); // Public newsfeed
router.get('/ads', getActiveAds); // Active native ads
router.get('/:slug', getPostBySlug); // Single public post
router.get('/admin', authenticateToken, getAllPostsForAdmin); // Admin newsfeed
router.put('/:id/status', authenticateToken, updatePostStatus);

// Crew endpoints
router.get('/boat/:boatId', authenticateToken, getPostsByBoatId); // Get all posts (incl DRAFT) for a specific boat
router.put('/:id/toggle-status', authenticateToken, togglePostStatus); // Toggle DRAFT / PUBLISHED

// Voting endpoint
router.post('/:id/vote', authenticateToken, toggleVote);

export default router;
