import { Router } from 'express';
import { getRender } from '../controllers/render.controller';

const router = Router();

router.get('/', getRender);

export default router;
