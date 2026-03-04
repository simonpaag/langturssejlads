import { Resend } from 'resend';

export const sendInviteEmail = async (toEmail: string) => {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('BEMÆRK: RESEND_API_KEY mangler i serverens miljøvariabler. Invitation afbrudt.');
            return { success: false, error: 'API nøgle mangler.' };
        }

        const resend = new Resend(apiKey);

        const data = await resend.emails.send({
            from: 'Langturssejlads.dk <info@langturssejlads.dk>', // Bemærk: Dette virker kun hvis domænet er verificeret på Resend
            to: [toEmail],
            subject: 'Du er blevet anbefalet til Langturssejlads.dk ⛵',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
                    <h2 style="color: #0f2c59; font-family: 'Merriweather', serif; font-size: 24px; margin-bottom: 24px;">En ven synes vi mangler din båd!</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                        Hej Kaptajn,
                    </p>
                    
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
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                        Vi glæder os til at læse jeres eventyr på logbogen.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 24px;" />
                    
                    <p style="font-size: 12px; color: #6b7280; text-align: center;">
                        Fair winds,<br>
                        <strong>Besætningen bag Langturssejlads.dk</strong><br>
                        <a href="https://langturssejlads.dk" style="color: #0f2c59; text-decoration: underline;">Besøg vores forside</a>
                    </p>
                </div>
            `,
        });

        return { success: true, data };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
};
