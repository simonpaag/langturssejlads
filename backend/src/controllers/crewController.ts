import { Response, Request } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendCrewInviteEmail } from '../utils/emailService';
import crypto from 'crypto';

// Helper for check
async function checkRole(userId: number, boatId: number) {
    const mem = await prisma.crewMember.findUnique({
        where: { userId_boatId: { userId, boatId } }
    });
    return mem?.role;
}

// 1. Invite a crew member
export const inviteCrewMember = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { boatId, email, role } = req.body;
        const myId = req.user?.userId;
        if (!myId) { res.status(401).json({ error: 'Unauthorized' }); return; }

        const myRole = await checkRole(myId, Number(boatId));
        if (myRole !== 'OWNER' && myRole !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden. Du skal være Admin eller Ejer.' }); return;
        }

        // Check if user is already crew
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const alreadyCrew = await checkRole(existingUser.id, Number(boatId));
            if (alreadyCrew) {
                res.status(400).json({ error: 'Brugeren er allerede en del af besætningen.' }); return;
            }
        }

        // Check if already invited
        const existingInvite = await prisma.boatInvitation.findUnique({ where: { email_boatId: { email, boatId: Number(boatId) } } });
        if (existingInvite) {
            res.status(400).json({ error: 'Brugeren er allerede inviteret.' }); return;
        }

        const boat = await prisma.boat.findUnique({ where: { id: Number(boatId) } });
        if (!boat) { res.status(404).json({ error: 'Båden findes ikke.' }); return; }

        const token = crypto.randomBytes(32).toString('hex');

        await prisma.boatInvitation.create({
            data: {
                email,
                role: role || 'CREW',
                boatId: Number(boatId),
                token
            }
        });

        const rolesMap: any = { 'OWNER': 'Ejer', 'ADMIN': 'Admin', 'CONTENT_MANAGER': 'Content Manager', 'CREW': 'Gast' };
        await sendCrewInviteEmail(email, token, boat.name, rolesMap[role || 'CREW']);

        res.status(201).json({ message: 'Invitation sendt!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 2. Get invitation (For accept page)
export const getInvitation = async (req: Request, res: Response): Promise<void> => {
    try {
        const invite = await prisma.boatInvitation.findUnique({
            where: { token: req.params.token },
            include: { boat: { select: { name: true, coverImage: true, slug: true } } }
        });
        if (!invite) { res.status(404).json({ error: 'Ugyldigt eller udløbet link.' }); return; }

        res.json(invite);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 3. Accept invitation
export const acceptInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const myId = req.user?.userId;
        if (!myId) { res.status(401).json({ error: 'Unauthorized' }); return; }

        const invite = await prisma.boatInvitation.findUnique({ where: { token: req.params.token } });
        if (!invite) { res.status(404).json({ error: 'Ugyldigt eller udløbet link.' }); return; }

        const me = await prisma.user.findUnique({ where: { id: myId } });
        if (me?.email !== invite.email) {
            res.status(403).json({ error: 'Du er logget ind med en anden email end invitationens.' }); return;
        }

        await prisma.crewMember.create({
            data: {
                userId: myId,
                boatId: invite.boatId,
                role: invite.role
            }
        });

        await prisma.boatInvitation.delete({ where: { token: req.params.token } });

        res.status(200).json({ message: 'Velkommen ombord!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 4. Get boat crew
export const getBoatCrew = async (req: Request, res: Response): Promise<void> => {
    try {
        const boatId = Number(req.params.boatId);
        const crew = await prisma.crewMember.findMany({
            where: { boatId },
            include: { user: { select: { id: true, name: true, email: true, profileImage: true } } }
        });

        // Also fetch invites if they belong to this boat
        const invites = await prisma.boatInvitation.findMany({
            where: { boatId },
            select: { id: true, email: true, role: true, createdAt: true }
        });

        res.json({ crew, invites });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 5. Update crew role
export const updateCrewRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boatId = Number(req.params.boatId);
        const targetUserId = Number(req.params.userId);
        const { newRole } = req.body;
        const myId = req.user?.userId;

        if (!myId) { res.status(401).json({ error: 'Unauthorized' }); return; }

        const myRole = await checkRole(myId, boatId);
        const targetRole = await checkRole(targetUserId, boatId);

        if (!myRole || !targetRole) { res.status(404).json({ error: 'Member not found' }); return; }

        if (myRole !== 'OWNER' && myRole !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden. Du skal være Admin eller Ejer.' }); return;
        }

        if (targetRole === 'OWNER' && myRole !== 'OWNER') {
            res.status(403).json({ error: 'Kun Ejeren kan redigere Ejerens rolle.' }); return;
        }

        await prisma.crewMember.update({
            where: { userId_boatId: { userId: targetUserId, boatId } },
            data: { role: newRole }
        });

        res.json({ message: 'Rolle opdateret' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 6. Remove crew member
export const removeCrewMember = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boatId = Number(req.params.boatId);
        const targetUserId = Number(req.params.userId);
        const myId = req.user?.userId;

        if (!myId) { res.status(401).json({ error: 'Unauthorized' }); return; }

        const myRole = await checkRole(myId, boatId);
        const targetRole = await checkRole(targetUserId, boatId);

        if (!myRole || !targetRole) { res.status(404).json({ error: 'Member not found' }); return; }

        if (myId !== targetUserId) {
            if (myRole !== 'OWNER' && myRole !== 'ADMIN') {
                res.status(403).json({ error: 'Forbidden. Du har ikke rettigheder.' }); return;
            }
            if (targetRole === 'OWNER') {
                res.status(403).json({ error: 'Ejeren kan ikke slettes, medmindre man selv er Ejeren og sletter sig selv.' }); return;
            }
        }

        await prisma.crewMember.delete({
            where: { userId_boatId: { userId: targetUserId, boatId } }
        });

        res.json({ message: 'Besætningsmedlem fjernet' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 7. Delete invitation
export const deleteInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const inviteId = Number(req.params.id);
        const boatId = Number(req.params.boatId);
        const myId = req.user?.userId;
        if (!myId) { res.status(401).json({ error: 'Unauthorized' }); return; }

        const myRole = await checkRole(myId, boatId);
        if (myRole !== 'OWNER' && myRole !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden' }); return;
        }

        await prisma.boatInvitation.delete({ where: { id: inviteId } });
        res.json({ message: 'Invitation slettet' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
