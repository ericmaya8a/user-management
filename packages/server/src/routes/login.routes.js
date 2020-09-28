import { Router } from 'express';
import { getLoginRender } from '../controllers/login.controller';

const router = Router();

router.get('/', getLoginRender);

export default router;
