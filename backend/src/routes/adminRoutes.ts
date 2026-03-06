import { Router } from 'express';
import { authenticateToken, authorizeSystemAdmin } from '../middlewares/authMiddleware';
import {
    getUsers, promoteUser,
    getLogs,
    getAdminPosts, updatePostModeration,
    getEmailTemplates, updateEmailTemplate, getSentEmails,
    getNativeAdsAdmin, createNativeAd, updateNativeAd, deleteNativeAd
} from '../controllers/adminController';

const router = Router();

// Alle ruter under /admin kræver system admin!
router.use(authenticateToken);
router.use(authorizeSystemAdmin);

// Users
router.get('/users', getUsers);
router.put('/users/:id/promote', promoteUser);

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

export default router;
