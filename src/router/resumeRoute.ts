import { Router } from 'express';
import multer from 'multer';
import { updloadResumeToLlm } from '../controllers/resumeController';

export const resumeRouter = Router();
const upload = multer({ dest: 'uploads/' });

resumeRouter.get('/', async (req, res) => {
    res.status(200).send('Hello World from resume router in server');
});

resumeRouter.post('/upload-cv-and-analyze', upload.single('resume'), updloadResumeToLlm);
