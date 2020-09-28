import { Router } from 'express';
import { getRender } from '../controllers/render.controller';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getRender);

export default router;
