import { Request, Response } from 'express';
import { sendInviteEmail } from '../utils/emailService';

export const sendInvite = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            res.status(400).json({ error: 'Ugyldig eller manglende e-mail adresse.' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'E-mail adressen er ikke i et gyldigt format.' });
            return;
        }

        const result = await sendInviteEmail(email);

        if (result.success) {
            res.json({ message: 'Invitation sendt succesfuldt!' });
        } else {
            res.status(500).json({ error: 'Kunne ikke sende email just nu. Prøv igen senere.' });
        }
    } catch (error) {
        console.error('Invite controller error:', error);
        res.status(500).json({ error: 'Intern server fejl.' });
    }
};
