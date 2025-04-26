import { Router } from 'express';
import { getUserById, updateUser } from '../controllers/usersController';

export const usersRouter = Router();

usersRouter.get('/:id', getUserById);

usersRouter.put('/:id', updateUser);
