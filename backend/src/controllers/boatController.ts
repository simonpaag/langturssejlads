import { Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';
import { checkBoatAccess } from '../utils/authHelpers';
import { logAction } from '../utils/auditLogger';
import slugify from 'slugify';

export const createBoat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, coverImage, profileImage, boatModel, length, width, tonnage, bunks, skipOwner } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        
        // Ensure only system admins can use the skipOwner flag
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const canSkipOwner = skipOwner && user?.isSystemAdmin;

        // Create the boat and assign the creator as OWNER safely in a transaction (unless skipOwner is set by an admin)
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

            if (!canSkipOwner) {
                await tx.crewMember.create({
                    data: {
                        userId,
                        boatId: boat.id,
                        role: 'OWNER',
                    },
                });
            }

            return boat;
        });

        logAction('CREATED_BOAT', userId, newBoat.id, { name: newBoat.name }).catch(e => console.error(e));

        res.status(201).json({ message: 'Boat created successfully', boat: newBoat });
    } catch (error) {
        console.error('Create boat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getBoats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limitStr = req.query.limit as string;
        const limit = limitStr ? parseInt(limitStr) : 1000; // Large default limit so frontend doesn't break
        const skip = (page - 1) * limit;

        const boats = await prisma.boat.findMany({
            where: { isActive: true },
            include: {
                crewMemberships: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, profileImage: true }
                        }
                    }
                }
            },
            skip,
            take: limit,
        });
        res.set('Cache-Control', 'public, max-age=60');
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
        const { name, description, coverImage, profileImage, websiteUrl, socialLinks, boatModel, length, width, tonnage, bunks, isActive } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (isNaN(boatId)) {
            res.status(400).json({ error: 'Invalid boat ID' });
            return;
        }

        // Verify that the user is an admin for this boat (eller SuperAdmin)
        const access = await checkBoatAccess(userId, boatId, req.user?.isSystemAdmin || false);

        if (!access.hasAccess || (access.role !== 'OWNER' && access.role !== 'ADMIN')) {
            res.status(403).json({ error: 'Forbidden: You are not an admin of this boat' });
            return;
        }

        // Format the URL to automatically include https:// if forgotten
        const formattedWebsiteUrl = websiteUrl 
            ? (websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://') ? websiteUrl : `https://${websiteUrl}`) 
            : websiteUrl;

        // Format social links
        let formattedSocialLinks = socialLinks;
        if (Array.isArray(socialLinks)) {
            formattedSocialLinks = socialLinks.map((link: any) => {
                if (link && link.url && typeof link.url === 'string') {
                    const lUrl = link.url.trim();
                    if (lUrl && !lUrl.startsWith('http://') && !lUrl.startsWith('https://')) {
                        return { ...link, url: `https://${lUrl}` };
                    }
                }
                return link;
            });
        }

        // Update the boat
        const updateData: any = {
            description,
            coverImage,
            profileImage,
            websiteUrl: formattedWebsiteUrl,
            socialLinks: formattedSocialLinks,
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

        if (isActive !== undefined) {
            updateData.isActive = Boolean(isActive);
        }

        const updatedBoat = await prisma.boat.update({
            where: { id: boatId },
            data: updateData
        });

        logAction('UPDATED_BOAT_PROFILE', userId, updatedBoat.id, updateData).catch(e => console.error(e));
        
        // Specifik specifik logning for billeder, da det er højt engagerende content
        if (coverImage || profileImage) {
            logAction('UPLOADED_BOAT_IMAGE', userId, updatedBoat.id, { 
                coverImage: coverImage ? true : undefined, 
                profileImage: profileImage ? true : undefined 
            }).catch(e => console.error(e));
        }

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

        const access = await checkBoatAccess(userId, boatId, req.user?.isSystemAdmin || false);

        if (!access.hasAccess || access.role !== 'OWNER') {
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

export const claimBoatRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boatId = parseInt(req.params.id as string);
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Email er påkrævet' });
            return;
        }

        const boat = await prisma.boat.findUnique({
            where: { id: boatId },
            include: { crewMemberships: true }
        });

        if (!boat) {
            res.status(404).json({ error: 'Båden blev ikke fundet' });
            return;
        }

        if (boat.crewMemberships.length > 0) {
            res.status(400).json({ error: 'Denne båd har allerede en fuld besætning tilknyttet' });
            return;
        }

        const { sendClaimBoatEmail } = await import('../utils/emailService');
        const emailResult = await sendClaimBoatEmail(email, boat.name);

        if (!emailResult.success) {
            console.error('Kunne ikke sende claim email', emailResult.error);
            res.status(500).json({ error: 'Kunne ikke sende anmodningen just nu, prøv igen.' });
            return;
        }

        res.json({ message: 'Anmodning sendt med succes' });
    } catch (error) {
        console.error('Claim boat request error:', error);
        res.status(500).json({ error: 'Der opstod en systemfejl' });
    }
};
