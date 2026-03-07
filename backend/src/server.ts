import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Langturssejlads.dk Backend API is running!');
});

import authRoutes from './routes/authRoutes';
import boatRoutes from './routes/boatRoutes';
import crewRoutes from './routes/crewRoutes';
import postRoutes from './routes/postRoutes';
import voyageRoutes from './routes/voyageRoutes';
import boardMessageRoutes from './routes/boardMessageRoutes';
import inviteRoutes from './routes/inviteRoutes';
import contactRoutes from './routes/contactRoutes';
import faqRoutes from './routes/faqRoutes';
import searchRoutes from './routes/searchRoutes';
import adminRoutes from './routes/adminRoutes';
import ideaRoutes from './routes/ideaRoutes';

// We will import and mount routes here later
app.use('/api/auth', authRoutes);
app.use('/api/boats', boatRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/voyages', voyageRoutes);
app.use('/api', boardMessageRoutes); // Mounts to /api/boats/:id/messages and /api/messages/:id
app.use('/api/invite', inviteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ideas', ideaRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
