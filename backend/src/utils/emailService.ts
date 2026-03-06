import { Resend } from 'resend';
import { prisma } from '../server';

export const sendInviteEmail = async (toEmail: string) => {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('BEMÆRK: RESEND_API_KEY mangler i serverens miljøvariabler. Invitation afbrudt.');
            return {
                success: false, error: 'API_NØGLE_MANGLER_DIAGNOSTIK: ' + JSON.stringify({
                    exists: !!apiKey,
                    type: typeof apiKey,
                    val: apiKey,
                    keys: Object.keys(process.env).filter(k => k.includes('RESEND'))
                })
            };
        }

        const resend = new Resend(apiKey);

        let subject = 'Du er blevet anbefalet til Langturssejlads.dk ⛵';
        let bodyHtml = '';

        // Fetch template from DB
        try {
            const template = await prisma.emailTemplate.findUnique({
                where: { name: 'INVITE_EMAIL' }
            });
            if (template) {
                subject = template.subject;
                bodyHtml = template.bodyHtml;
            }
        } catch (dbError) {
            console.error('Kunne ikke hente EmailTemplate fra DB, falder tilbage:', dbError);
        }

        const { data, error } = await resend.emails.send({
            from: 'Langturssejlads.dk <info@langturssejlads.dk>',
            to: [toEmail],
            subject: subject,
            html: bodyHtml || `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
                    <h2 style="color: #0f2c59; font-family: 'Merriweather', serif; font-size: 24px; margin-bottom: 24px;">En ven synes vi mangler din båd!</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hej Kaptajn,</p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Nogen derude tjekkede nyhederne på <strong>Langturssejlads.dk</strong>, og bemærkede at din båd manglede i flåden! 
                        Platformen er et voksende, gratis samlingspunkt for danske sejlere på verdenshavene - et sted hvor jeres logbøger, 
                        billeder og togter kan leve struktureret og samlet, uafhængigt af tech-giganternes algoritmer.
                    </p>
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="https://langturssejlads.dk/opret-baad" style="background-color: #0f2c59; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                            Tilmeld din båd nu
                        </a>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Email sending returned an error from Resend:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email sending failed in try-catch:', error);
        return { success: false, error };
    }
};
