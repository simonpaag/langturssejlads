import { Router } from 'express';
import { createVoyage, getVoyage, updateVoyage, deleteVoyage, getVoyagesForBoat, getAllVoyages } from '../controllers/voyageController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllVoyages);
router.post('/', authenticateToken, createVoyage);
router.get('/boat/:boatId', getVoyagesForBoat);
router.get('/:id', getVoyage);
router.put('/:id', authenticateToken, updateVoyage);
router.delete('/:id', authenticateToken, deleteVoyage);

export default router;
