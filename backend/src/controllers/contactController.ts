import { Request, Response } from 'express';
import { Resend } from 'resend';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';
import { checkBoatAccess } from '../utils/authHelpers';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ error: 'Udfyld venligst alle felter (Navn, Email og Besked).' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Den indtastede email ser ikke ud til at være gyldig.' });
            return;
        }

        const apiKey = process.env.RESEND_API_KEY;

        // GEM IDÉEN I DATABASEN
        const newIdea = await prisma.idea.create({
            data: {
                name,
                email,
                message,
                status: 'IDEA'
            }
        });

        let data: any = null;
        if (!apiKey) {
            console.error('BEMÆRK: RESEND_API_KEY mangler. Beskeden kunne ikke sendes via mail, men er gemt i systemet.');
            // Vi returnerer succes alligevel, da ideen ligger i databasen.
            res.json({ message: 'Din besked er modtaget i logbogen!', idea: newIdea });
            return;
        }

        const resend = new Resend(apiKey);

        data = await resend.emails.send({
            from: 'Langturssejlads Support <info@langturssejlads.dk>',
            to: ['simon@paag.dk'],
            replyTo: email,
            subject: `Ny Besked fra ${name} (Langturssejlads.dk Vilkår)`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; padding: 20px; color: #111;">
                    <h2 style="color: #0f2c59; font-family: 'Merriweather', serif;">Ny Support-Besked</h2>
                    <p><strong>Afsender:</strong> ${name} &lt;${email}&gt;</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
                </div>
            `,
        });

        res.json({ message: 'Din besked er modtaget! Vi vender tilbage hurtigst muligt.', data, idea: newIdea });
    } catch (error) {
        console.error('Contact controller error:', error);
        res.status(500).json({ error: 'Intern server fejl under afsendelse.' });
    }
};

// POST /api/contact/boat
// Opretter en ny kontaktbesked (åben for alle besøgende)
export const submitBoatContactMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderName, senderEmail, message, boatId, voyageId } = req.body;

        if (!senderName || !senderEmail || !message || !boatId) {
            res.status(400).json({ error: 'Udfyld venligst alle obligatoriske felter (Navn, Email, Besked, Båd).' });
            return;
        }

        // Tjek om båden findes
        const boat = await prisma.boat.findUnique({ where: { id: Number(boatId) } });
        if (!boat) {
            res.status(404).json({ error: 'Båden blev ikke fundet.' });
            return;
        }

        const newMessage = await prisma.contactMessage.create({
            data: {
                senderName,
                senderEmail,
                message,
                boatId: Number(boatId),
                voyageId: voyageId ? Number(voyageId) : undefined,
            }
        });

        res.status(201).json({
            success: true,
            message: 'Din besked er sendt til båden!',
            data: newMessage,
        });

    } catch (error) {
        console.error('Submit contact message error:', error);
        res.status(500).json({ error: 'Der opstod en serverfejl. Prøv igen senere.' });
    }
};

// GET /api/contact/boat/:boatId
// Henter alle beskeder til en specifik båd (kræver at man er besætning på båden)
export const getMessagesForBoat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { boatId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Tjek om brugeren er besætning på denne båd
        const access = await checkBoatAccess(userId, Number(boatId), req.user?.isSystemAdmin || false);

        if (!access.hasAccess) {
            res.status(403).json({ error: 'Forbidden. Du har ikke adgang til denne båds beskeder.' });
            return;
        }

        const messages = await prisma.contactMessage.findMany({
            where: { boatId: Number(boatId) },
            include: {
                voyage: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Der opstod en serverfejl ved hentning af beskeder.' });
    }
};

// PUT /api/contact/boat/:id/read
// Markerer en besked som læst (kræver besætning)
export const markMessageAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const messageRecord = await prisma.contactMessage.findUnique({
            where: { id: Number(id) }
        });

        if (!messageRecord) {
            res.status(404).json({ error: 'Beskeden blev ikke fundet.' });
            return;
        }

        const access = await checkBoatAccess(userId, messageRecord.boatId, req.user?.isSystemAdmin || false);

        if (!access.hasAccess) {
            res.status(403).json({ error: 'Forbidden. Du har ikke adgang til at redigere denne besked.' });
            return;
        }

        const updatedMessage = await prisma.contactMessage.update({
            where: { id: Number(id) },
            data: { isRead: true }
        });

        res.json({ success: true, message: updatedMessage });
    } catch (error) {
        console.error('Mark message read error:', error);
        res.status(500).json({ error: 'Der opstod en serverfejl.' });
    }
};
