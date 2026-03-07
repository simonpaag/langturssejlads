import { Router } from 'express';
import { authenticateToken, authorizeSystemAdmin } from '../middlewares/authMiddleware';
import {
    getUsers, promoteUser, blockUser, deleteUser,
    getAdminBoats,
    getLogs,
    getAdminPosts, updatePostModeration,
    getEmailTemplates, updateEmailTemplate, getSentEmails,
    getNativeAdsAdmin, createNativeAd, updateNativeAd, deleteNativeAd,
    getAdminFaqs
} from '../controllers/adminController';
import { getAllIdeasAdmin, updateIdeaStatus, deleteIdea, createIdeaAdmin } from '../controllers/ideaController';

const router = Router();

// Alle ruter under /admin kræver system admin!
router.use(authenticateToken);
router.use(authorizeSystemAdmin);

// Users
router.get('/users', getUsers);
router.put('/users/:id/promote', promoteUser);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);

// Boats
router.get('/boats', getAdminBoats);

// Logs
router.get('/logs', getLogs);

// Posts
router.get('/posts', getAdminPosts);
router.put('/posts/:id', updatePostModeration);

// Emails
router.get('/emails/templates', getEmailTemplates);
router.put('/emails/templates/:id', updateEmailTemplate);
router.get('/emails/sent', getSentEmails);

// Native Ads
router.get('/ads', getNativeAdsAdmin);
router.post('/ads', createNativeAd);
router.put('/ads/:id', updateNativeAd);
router.delete('/ads/:id', deleteNativeAd);

// Faqs
router.get('/faqs', getAdminFaqs);

// Ideas
router.get('/ideas', getAllIdeasAdmin);
router.post('/ideas', createIdeaAdmin);
router.put('/ideas/:id', updateIdeaStatus);
router.delete('/ideas/:id', deleteIdea);

export default router;
