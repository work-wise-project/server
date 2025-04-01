import { Router } from 'express';
import { getUserById } from '../controllers/usersController';

const router = Router();

router.get('/:id', getUserById);

export default router;
