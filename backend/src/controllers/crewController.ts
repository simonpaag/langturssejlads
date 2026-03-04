import { Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addCrewMember = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { boatId, email, role } = req.body; // role should be 'BOAT_ADMIN' or 'BOAT_AUTHOR'
        const adminId = req.user?.userId;

        if (!adminId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Check if the requester is actually a BOAT_ADMIN for this boat
        const adminMembership = await prisma.crewMember.findUnique({
            where: {
                userId_boatId: {
                    userId: adminId,
                    boatId: Number(boatId),
                },
            },
        });

        if (!adminMembership || adminMembership.role !== 'BOAT_ADMIN') {
            res.status(403).json({ error: 'Forbidden. You must be a boat admin to add crew.' });
            return;
        }

        // Find the user to add by email
        const userToAdd = await prisma.user.findUnique({ where: { email } });
        if (!userToAdd) {
            res.status(404).json({ error: 'User with this email not found. They must register first.' });
            return;
        }

        // Add them to the crew
        const newCrew = await prisma.crewMember.create({
            data: {
                userId: userToAdd.id,
                boatId: Number(boatId),
                role,
            },
        });

        res.status(201).json({ message: 'Crew member added successfully', crew: newCrew });
    } catch (error) {
        console.error('Add crew error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
