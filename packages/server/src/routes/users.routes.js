import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser
} from '../controllers/users.controller';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.delete('/:userId', authorize(['super']), deleteUser);
router.post('/', authorize(['admin', 'super']), createUser);

export default router;
