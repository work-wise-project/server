import axios, { HttpStatusCode } from 'axios';
import { Router } from 'express';
import multer from 'multer';
import { getConfig } from '../config/config';

const { sttServiceUrl } = getConfig();

const upload = multer();

export const interviewRouter = Router();

interviewRouter.post('/analysis', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(HttpStatusCode.BadRequest).send({ error: 'No file uploaded' });
            return;
        }

        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append(req.file.fieldname, blob, req.file.originalname);

        const { data } = await axios.post(`${sttServiceUrl}/api/transcript`, formData);

        res.status(HttpStatusCode.Ok).send(data);
    } catch (error) {
        console.error('Error during STT service request:', error);
        res.status(HttpStatusCode.InternalServerError).send({ error: 'Internal Server Error' });
    }
});
