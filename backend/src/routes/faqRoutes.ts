import { Router } from 'express';
import { getFaqs, getFaqBySlug, createFaq, updateFaq, deleteFaq } from '../controllers/faqController';
import { authenticateToken, authorizeSystemAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getFaqs);
router.get('/:slug', getFaqBySlug);
router.post('/', authenticateToken, authorizeSystemAdmin, createFaq);
router.put('/:id', authenticateToken, authorizeSystemAdmin, updateFaq);
router.delete('/:id', authenticateToken, authorizeSystemAdmin, deleteFaq);

export default router;
