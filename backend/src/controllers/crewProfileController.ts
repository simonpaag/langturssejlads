import { Request, Response } from 'express';
import { prisma } from '../server';

// Get a public list of all active crew profiles
export const getActiveCrewProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const profiles = await prisma.crewProfile.findMany({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    }
                }
            }
        });
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching crew profiles:', error);
        res.status(500).json({ error: 'Kunne ikke hente gaste-profiler' });
    }
};

// Get a specific crew profile by user ID
export const getCrewProfileByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId as string);

        const profile = await prisma.crewProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        crewMemberships: {
                            include: {
                                boat: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                        profileImage: true,
                                        isActive: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!profile) {
            res.status(404).json({ error: 'Profil ikke fundet' });
            return;
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching crew profile:', error);
        res.status(500).json({ error: 'Kunne ikke hente gaste-profil' });
    }
};

// Get the authenticated user's own crew profile
export const getMyCrewProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;

        const profile = await prisma.crewProfile.findUnique({
            where: { userId }
        });

        // It is perfectly okay if they do not have one yet.
        res.json(profile || null);
    } catch (error) {
        console.error('Error fetching my crew profile:', error);
        res.status(500).json({ error: 'Kunne ikke indlæse din profil' });
    }
};

// Create or update the authenticated user's crew profile
export const upsertMyCrewProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;
        const { description, availablePeriod, experience, homePort, galleryImages, isActive } = req.body;

        if (!description || description.trim() === '') {
            res.status(400).json({ error: 'Profiltekst er påkrævet.' });
            return;
        }

        const upsertedProfile = await prisma.crewProfile.upsert({
            where: { userId },
            update: {
                description,
                availablePeriod: availablePeriod || null,
                experience: experience || null,
                homePort: homePort || null,
                galleryImages: galleryImages || [],
                isActive: isActive !== undefined ? isActive : true
            },
            create: {
                userId,
                description,
                availablePeriod: availablePeriod || null,
                experience: experience || null,
                homePort: homePort || null,
                galleryImages: galleryImages || [],
                isActive: isActive !== undefined ? isActive : true
            }
        });

        res.json(upsertedProfile);
    } catch (error) {
        console.error('Error upserting crew profile:', error);
        res.status(500).json({ error: 'Kunne ikke gemme gaste-profil' });
    }
};
