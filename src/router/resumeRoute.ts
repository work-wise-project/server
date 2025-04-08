import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { analyzeOrCheckResume, uploadResume } from '../controllers/resumeController';

export const resumeRouter = Router();

// Create upload folder if not exists - temp until s3 is implemented
const uploadFolder = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, uploadFolder);
    },
    filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage });

resumeRouter.get('/', async (req, res) => {
    res.status(200).send('Hello World from resume router in server');
});

resumeRouter.post('/analyze-resume', analyzeOrCheckResume(true));
resumeRouter.post('/check-grammar', analyzeOrCheckResume(false));

resumeRouter.post('/upload-resume', upload.single('resume'), uploadResume);
