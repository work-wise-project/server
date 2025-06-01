import { Router } from 'express';
import { getAllSkills } from '../controllers/skillsController';

export const skillsRouter = Router();

skillsRouter.get('/', getAllSkills);
