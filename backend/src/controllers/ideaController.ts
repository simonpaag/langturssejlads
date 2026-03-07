import { Request, Response } from 'express';
import { prisma } from '../server';

export const getIdeas = async (req: Request, res: Response): Promise<void> => {
    try {
        const ideas = await prisma.idea.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                message: true,
                status: true,
                createdAt: true,
                // We exclude email from the public endpoint for privacy
            }
        });
        res.json(ideas);
    } catch (error) {
        console.error('Error fetching ideas:', error);
        res.status(500).json({ error: 'Kunne ikke hente idéer' });
    }
};

export const getAllIdeasAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const ideas = await prisma.idea.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(ideas);
    } catch (error) {
        console.error('Error fetching admin ideas:', error);
        res.status(500).json({ error: 'Kunne ikke hente idéer' });
    }
};

export const updateIdeaStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['IDEA', 'IN_PROCESS', 'IN_TEST', 'LIVE'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Ugyldig status' });
            return;
        }

        const updatedIdea = await prisma.idea.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json(updatedIdea);
    } catch (error) {
        console.error('Error updating idea status:', error);
        res.status(500).json({ error: 'Kunne ikke opdatere idé' });
    }
};

export const deleteIdea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.idea.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true, message: 'Idé slettet' });
    } catch (error) {
        console.error('Error deleting idea:', error);
        res.status(500).json({ error: 'Kunne ikke slette idé' });
    }
};
