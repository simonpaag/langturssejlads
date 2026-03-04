import { Router } from 'express';
import { sendInvite } from '../controllers/inviteController';

const router = Router();

router.post('/', sendInvite);

export default router;
