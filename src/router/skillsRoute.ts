import { Router } from 'express';
import { getAllSkills } from '../controllers/skillsController';

const router = Router();

router.get('/', getAllSkills);

export default router;
