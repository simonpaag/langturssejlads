import { Request, Response } from 'express';
import { prisma } from '../server';
import { GoogleGenAI } from '@google/genai';

// --- USERS ---
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, isSystemAdmin: true, isBlocked: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getAdminBoats = async (req: Request, res: Response): Promise<void> => {
    try {
        const boats = await prisma.boat.findMany({
            orderBy: { id: 'desc' },
            include: {
                crewMemberships: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            }
        });
        res.json(boats);
    } catch (error) {
        console.error('Error fetching admin boats:', error);
        res.status(500).json({ error: 'Kunne ikke hente både' });
    }
};

export const promoteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const { isSystemAdmin } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isSystemAdmin },
            select: { id: true, name: true, email: true, isSystemAdmin: true }
        });

        // Log action
        await prisma.auditLog.create({
            data: {
                action: 'UPDATED_USER_ROLE',
                entityId: id,
                details: `Bruger gjort til system-tildeling: ${isSystemAdmin}`,
                userId: (req as any).user.userId
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error promoting user:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
};

export const blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const { isBlocked } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isBlocked },
            select: { id: true, name: true, email: true, isBlocked: true }
        });

        await prisma.auditLog.create({
            data: {
                action: isBlocked ? 'BLOCKED_USER' : 'UNBLOCKED_USER',
                entityId: id,
                details: `Bruger blokeringsstatus ændret til: ${isBlocked}`,
                userId: (req as any).user?.userId || null
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Failed to update user block status' });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);

        await prisma.user.delete({
            where: { id }
        });

        await prisma.auditLog.create({
            data: {
                action: 'DELETED_USER',
                entityId: id,
                details: `Bruger med ID ${id} blev permanent slettet.`,
                userId: (req as any).user?.userId || null
            }
        });

        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// --- LOGS ---
export const getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
            include: {
                user: { select: { name: true, email: true } }
            }
        });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Kunne ikke hente aktivitetslogs' });
    }
};

export const getGitLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch from public GitHub API instead of local git log (since we run in Docker on Cloud Run without .git)
        const response = await fetch('https://api.github.com/repos/simonpaag/langturssejlads/commits?per_page=50', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'PosseidonAdmin-App'
            }
        });

        if (!response.ok) {
            console.error(`GitHub API returned ${response.status}: ${response.statusText}`);
            res.status(500).json({ error: 'Fejl under indlæsning af git logs fra GitHub' });
            return;
        }

        const data = await response.json();

        // Map GitHub API response to the format expected by the frontend
        const logs = data.map((commitData: any) => ({
            hash: commitData.sha || '',
            authorName: commitData.commit?.author?.name || '',
            authorEmail: commitData.commit?.author?.email || '',
            date: commitData.commit?.author?.date || '',
            message: commitData.commit?.message?.split('\n')[0] || '' // Take first line of message
        }));

        res.json(logs);
    } catch (error) {
        console.error('Error in getGitLogs:', error);
        res.status(500).json({ error: 'Kunne ikke hente git logs fra GitHub' });
    }
};

// --- POSTS MODERATION ---
export const getAdminPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true } },
                boat: { select: { name: true, slug: true } }
            }
        });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching admin posts:', error);
        res.status(500).json({ error: 'Kunne ikke hente indlæg' });
    }
};

export const updatePostModeration = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.id as string);
        const { showOnFrontpage, status } = req.body;

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                ...(showOnFrontpage !== undefined && { showOnFrontpage }),
                ...(status !== undefined && { status }),
            }
        });

        // Log action
        await prisma.auditLog.create({
            data: {
                action: 'MODERATED_POST',
                entityId: postId,
                details: `Moderator handling. Status: ${status}, showOnFrontpage: ${showOnFrontpage}`,
                userId: (req as any).user.userId
            }
        });

        res.json(updatedPost);
    } catch (error) {
        console.error('Error moderating post:', error);
        res.status(500).json({ error: 'Fejl ved moderering af indlægget' });
    }
};

// --- EMAIL TEMPLATES & LOGS ---
export const getEmailTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
        const templates = await prisma.emailTemplate.findMany();
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Failed to fetch' });
    }
};

export const updateEmailTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const { subject, bodyHtml } = req.body;

        const updated = await prisma.emailTemplate.update({
            where: { id },
            data: { subject, bodyHtml }
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ error: 'Failed to update' });
    }
};

export const getSentEmails = async (req: Request, res: Response): Promise<void> => {
    try {
        const emails = await prisma.sentEmail.findMany({
            orderBy: { sentAt: 'desc' },
            take: 200
        });
        res.json(emails);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).json({ error: 'Failed' });
    }
};

// --- NATIVE ADS ---
export const getAdminFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
        const faqs = await prisma.faqArticle.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(faqs);
    } catch (error) {
        console.error('Error fetching admin faqs:', error);
        res.status(500).json({ error: 'Failed' });
    }
};

export const getNativeAdsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const ads = await prisma.nativeAd.findMany({
            orderBy: { placement: 'asc' }
        });
        res.json(ads);
    } catch (error) {
        console.error('Error fetching ads:', error);
        res.status(500).json({ error: 'Failed' });
    }
};

export const createNativeAd = async (req: Request, res: Response): Promise<void> => {
    try {
        const { headline, content, imageUrl, linkUrl, placement, startDate, endDate, isActive } = req.body;
        const newAd = await prisma.nativeAd.create({
            data: {
                headline: String(headline),
                content: String(content),
                imageUrl: imageUrl ? String(imageUrl) : null,
                linkUrl: linkUrl ? String(linkUrl) : null,
                placement: parseInt(String(placement)) || 0,
                startDate: startDate ? new Date(String(startDate)) : null,
                endDate: endDate ? new Date(String(endDate)) : null,
                isActive: isActive ?? true
            }
        });
        res.json(newAd);
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ error: 'Failed to create' });
    }
};

export const updateNativeAd = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        const { headline, content, imageUrl, linkUrl, placement, startDate, endDate, isActive } = req.body;
        const updatedAd = await prisma.nativeAd.update({
            where: { id },
            data: {
                headline: headline !== undefined ? String(headline) : undefined,
                content: content !== undefined ? String(content) : undefined,
                imageUrl: imageUrl !== undefined ? (imageUrl ? String(imageUrl) : null) : undefined,
                linkUrl: linkUrl !== undefined ? (linkUrl ? String(linkUrl) : null) : undefined,
                placement: placement !== undefined ? parseInt(String(placement)) : undefined,
                startDate: startDate !== undefined ? (startDate ? new Date(String(startDate)) : null) : undefined,
                endDate: endDate !== undefined ? (endDate ? new Date(String(endDate)) : null) : undefined,
                isActive
            }
        });
        res.json(updatedAd);
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ error: 'Failed to update' });
    }
};

export const deleteNativeAd = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);
        await prisma.nativeAd.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ error: 'Failed to delete' });
    }
};

// --- GEMINI AI INTEGRATION ---
export const generateFaqContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { topic } = req.body;
        if (!topic) {
            res.status(400).json({ error: 'Emne mangler' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.status(500).json({ error: 'GEMINI_API_KEY er ikke sat på serveren' });
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const systemInstruction = `Du er en dygtig ekspertskribent og researcher for "Danske Langturssejlere", en forening og vidensplatform for langfartssejlere. 
Brugeren beder dig om hjælp til at undersøge, opsummere eller skrive et stykke indhold til platformens "Vidensbase / FAQ".

Det er DIT job at levere et super velskrevet svar, med et maritimt, engagerende, velresearchet og professionelt sprog.
Du har adgang til Google Search-værktøjet til at finde opdateret information (søg på nettet, hvis bedt om det, eller for at dobbelttjekke tekniske oplysninger som navigation, ankersystemer, havne osv.).

VIGTIGT:
1. Din primære opgave er at generere tekst, som formateres direkte til at passe ind i vores WYSIWYG HTML-editor.
2. Formater dit ENDELIGE OUTPUT i REN HTML.
3. Brug tags som <h2>, <h3> til velvalgte overskrifter, <p> til faste overskuelige afsnit, <br/> til linjeskift, og <ul><li> til læsbare lister, fordele/ulemper eller tips.
4. Gør teksten indbydende at læse, markér gerne vigtige keywords i <strong>.
5. VIKTIGSTE REGEL: Undlad ALLE intro-replikker ("Her er din tekst:", "Selvfølgelig..."). Og pak ALDRIG din HTML ind i markdown code blocks som "\`\`\`html"! SPYT DET RAA KODESTYKKE UT, der MÅ KUN VÆRE RENT HTML, KLAR TIL BROWSEREN! Ingenting før og ingenting efter HTML-tagsene!`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: topic,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
            }
        });

        let text = response.text || '';
        // Fjern markdown formatting blocks, hvis modellen kom the at inkludere det
        text = text.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
        text = text.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
        text = text.trim();

        res.json({ content: text });
    } catch (error) {
        console.error('Error generating AI text:', error);
        res.status(500).json({ error: 'Fejl under kommunikation med Gemini AI (Måske en netværksfejl eller ulovligt emne)' });
    }
};
