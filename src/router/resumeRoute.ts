import { Router } from 'express';
import multer from 'multer';
import { analyzeOrCheckResume, getResumeIfExist, uploadResume } from '../controllers/resumeController';

export const resumeRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

resumeRouter.get('/', async (req, res) => {
    res.status(200).send('Hello World from resume router in server');
});

resumeRouter.post('/analyze-resume/:userId', analyzeOrCheckResume(true));
resumeRouter.post('/check-grammar/:userId', analyzeOrCheckResume(false));

resumeRouter.post('/:userId', upload.single('resume'), uploadResume);
resumeRouter.get('/:userId', getResumeIfExist);
