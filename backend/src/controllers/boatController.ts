import { Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';
import slugify from 'slugify';

export const createBoat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, coverImage, profileImage, boatModel, length, width, tonnage, bunks } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Create the boat and assign the creator as OWNER safely in a transaction
        const newBoat = await prisma.$transaction(async (tx) => {
            const boat = await tx.boat.create({
                data: {
                    name,
                    slug: slugify(name, { lower: true, strict: true }),
                    description,
                    coverImage,
                    profileImage,
                    boatModel,
                    length: length ? parseFloat(length) : 0,
                    width: width ? parseFloat(width) : null,
                    tonnage: tonnage ? parseInt(tonnage) : null,
                    bunks: bunks ? parseInt(bunks) : null
                },
            });

            await tx.crewMember.create({
                data: {
                    userId,
                    boatId: boat.id,
                    role: 'OWNER',
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
                            select: { id: true, name: true, email: true, profileImage: true }
                        }
                    }
                },
                voyages: true
            }
        });
        res.json(boats);
    } catch (error) {
        console.error('Get boats error:', error);
        res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
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
                            select: { id: true, name: true, email: true, profileImage: true }
                        }
                    }
                },
                voyages: true
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

export const updateBoat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boatId = parseInt(req.params.id as string);
        const { name, description, coverImage, profileImage, websiteUrl, socialLinks, boatModel, length, width, tonnage, bunks } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (isNaN(boatId)) {
            res.status(400).json({ error: 'Invalid boat ID' });
            return;
        }

        // Verify that the user is an admin for this boat
        const crewMembership = await prisma.crewMember.findFirst({
            where: {
                boatId: boatId,
                userId: userId,
                role: 'OWNER'
            }
        });

        if (!crewMembership) {
            res.status(403).json({ error: 'Forbidden: You are not an admin of this boat' });
            return;
        }

        // Update the boat
        const updateData: any = {
            description,
            coverImage,
            profileImage,
            websiteUrl,
            socialLinks,
            boatModel,
        };

        // Parse the numeric specs
        if (length !== undefined && length !== null && length !== '') updateData.length = parseFloat(length);
        if (width !== undefined) updateData.width = width === '' || width === null ? null : parseFloat(width);
        if (tonnage !== undefined) updateData.tonnage = tonnage === '' || tonnage === null ? null : parseInt(tonnage);
        if (bunks !== undefined) updateData.bunks = bunks === '' || bunks === null ? null : parseInt(bunks);

        // Only update name and slug if the name is provided and changed
        if (name) {
            updateData.name = name;
            updateData.slug = slugify(name, { lower: true, strict: true });
        }

        const updatedBoat = await prisma.boat.update({
            where: { id: boatId },
            data: updateData
        });

        res.json({ message: 'Boat updated successfully', boat: updatedBoat });
    } catch (error) {
        console.error('Update boat error:', error);
        res.status(500).json({ error: 'Internal server error while updating boat' });
    }
};

export const updateBoardStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boatId = parseInt(req.params.id as string);
        const userId = req.user?.userId;
        const { isBoardPublic } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Uautoriseret' });
            return;
        }

        const crewMember = await prisma.crewMember.findFirst({
            where: {
                userId,
                boatId,
                role: 'OWNER'
            }
        });

        if (!crewMember && !req.user?.isSystemAdmin) {
            res.status(403).json({ error: 'Du har ikke rettigheder til at ændre opslagstavlens synlighed' });
            return;
        }

        const updatedBoat = await prisma.boat.update({
            where: { id: boatId },
            data: { isBoardPublic: Boolean(isBoardPublic) }
        });

        res.json({ message: 'Opslagstavlens status opdateret', isBoardPublic: updatedBoat.isBoardPublic });
    } catch (error) {
        console.error('Update board status error:', error);
        res.status(500).json({ error: 'Der opstod en fejl' });
    }
};
