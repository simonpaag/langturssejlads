import { Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';
import slugify from 'slugify';

export const createBoat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, coverImage } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Create the boat and assign the creator as BOAT_ADMIN safely in a transaction
        const newBoat = await prisma.$transaction(async (tx) => {
            const boat = await tx.boat.create({
                data: {
                    name,
                    slug: slugify(name, { lower: true, strict: true }),
                    description,
                    coverImage,
                },
            });

            await tx.crewMember.create({
                data: {
                    userId,
                    boatId: boat.id,
                    role: 'BOAT_ADMIN',
                },
            });

            return boat;
        });

        res.status(201).json({ message: 'Boat created successfully', boat: newBoat });
    } catch (error) {
        console.error('Create boat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getBoats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boats = await prisma.boat.findMany({
            include: {
                crewMemberships: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });
        res.json(boats);
    } catch (error) {
        console.error('Get boats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getBoatBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const boat = await prisma.boat.findUnique({
            where: { slug: String(slug) },
            include: {
                crewMemberships: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });

        if (!boat) {
            res.status(404).json({ error: 'Boat not found' });
            return;
        }

        res.json(boat);
    } catch (error) {
        console.error('Get boat by id error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
