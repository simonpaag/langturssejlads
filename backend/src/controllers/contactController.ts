import { Request, Response } from 'express';
import { Resend } from 'resend';

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
        if (!apiKey) {
            console.error('BEMÆRK: RESEND_API_KEY mangler. Beskeden kunne ikke sendes.');
            res.status(500).json({ error: 'Systemfejl: Kunne ikke afsende mail lige nu.' });
            return;
        }

        const resend = new Resend(apiKey);

        const data = await resend.emails.send({
            from: 'Langturssejlads Support <info@langturssejlads.dk>',
            to: ['kontakt@langturssejlads.dk'],
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

        res.json({ message: 'Din besked er modtaget! Vi vender tilbage hurtigst muligt.', data });
    } catch (error) {
        console.error('Contact controller error:', error);
        res.status(500).json({ error: 'Intern server fejl under afsendelse.' });
    }
};
