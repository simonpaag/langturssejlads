import { Router } from 'express';
import {
    inviteCrewMember,
    getInvitation,
    acceptInvitation,
    getBoatCrew,
    updateCrewRole,
    removeCrewMember,
    deleteInvitation,
    createJoinRequest,
    getMyJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest
} from '../controllers/crewController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// /api/crew

// Invite a crew member
router.post('/invite', authenticateToken, inviteCrewMember);

// Get invitation details (public/unauthenticated, to show the accept page)
router.get('/invite/:token', getInvitation);

// Accept invitation
router.post('/invite/:token/accept', authenticateToken, acceptInvitation);

// List crew and invites for a boat
router.get('/boat/:boatId', authenticateToken, getBoatCrew); // Using auth so we don't expose emails publicly

// Update crew role
router.put('/:userId/boat/:boatId', authenticateToken, updateCrewRole);

// Remove crew member
router.delete('/:userId/boat/:boatId', authenticateToken, removeCrewMember);

// Delete an invitation
router.delete('/invite/:id/boat/:boatId', authenticateToken, deleteInvitation);

// Create a join request
router.post('/join-request', authenticateToken, createJoinRequest);

// Get my join requests
router.get('/join-request', authenticateToken, getMyJoinRequests);

// Accept join request
router.post('/join-request/:id/accept/boat/:boatId', authenticateToken, acceptJoinRequest);

// Reject join request
router.post('/join-request/:id/reject/boat/:boatId', authenticateToken, rejectJoinRequest);

export default router;
