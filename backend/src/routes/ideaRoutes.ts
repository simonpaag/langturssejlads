import { Router } from 'express';
import { getIdeas } from '../controllers/ideaController';

const router = Router();

// Public route til at hente ideer til Boardet
router.get('/', getIdeas);

export default router;
