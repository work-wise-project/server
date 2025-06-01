import { Router } from 'express';
import { addSkills, getAllSkills } from '../controllers/skillsController';

export const skillsRouter = Router();

skillsRouter.get('/', getAllSkills);

skillsRouter.post('/', addSkills);
