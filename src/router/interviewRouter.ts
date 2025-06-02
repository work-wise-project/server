import axios, { HttpStatusCode } from 'axios';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getConfig } from '../config';
import { getInterviewPreparation } from '../controllers/interviewController';
import { AuthRequest } from '../middlewares/authMiddleware';

const { sttServiceUrl, llmServiceUrl, dataAccessManagerUrl } = getConfig();

const upload = multer();

export const interviewRouter = Router();

interviewRouter.get('/analysis/:interviewId', async (req, res) => {
    try {
        const { interviewId } = req.params;
        if (!interviewId) {
            res.status(HttpStatusCode.BadRequest).send({ error: 'Interview id is required' });
            return;
        }

        const { data: currentAnalysis } = await axios.get(`${dataAccessManagerUrl}/interviews/analysis/${interviewId}`);

        res.status(HttpStatusCode.Ok).send({ ...currentAnalysis });
    } catch (error) {
        console.error('Error during interview analysis request:', error);
        res.status(HttpStatusCode.InternalServerError).send({ error: 'Internal Server Error' });
    }
});

interviewRouter.post('/analysis/:interviewId', upload.single('file'), async (req: AuthRequest, res) => {
    try {
        const { interviewId } = req.params;
        if (!interviewId) {
            res.status(HttpStatusCode.BadRequest).send({ error: 'Interview id is required' });
            return;
        }
        if (!req.file) {
            res.status(HttpStatusCode.BadRequest).send({ error: 'No file uploaded' });
            return;
        }

        const { buffer, mimetype, fieldname, originalname } = req.file;
        const filename = `${interviewId}.${path.extname(originalname)}`;

        const formData = new FormData();
        formData.append(fieldname, new Blob([buffer], { type: mimetype }), filename);

        const { data: transcript } = await axios.post(`${sttServiceUrl}/api/transcript`, formData);
        console.log('finished transcription');

        const { data: context } = await axios.post(`${dataAccessManagerUrl}/interviews/analysis/context`, {
            interviewId,
            userId: req.currentUser.id,
        });
        console.log('retrieved interview context');

        const { data: analysis } = await axios.post(`${llmServiceUrl}/interviews/analysis`, { transcript, ...context });
        console.log('finished analysis');

        const interviewAnalysis = {
            interview_id: interviewId,
            file_name: originalname,
            file_type: req.body.fileType || mimetype.split('/')[0],
            analysis: analysis.analysis,
        };

        await axios.post(`${dataAccessManagerUrl}/interviews/analysis`, interviewAnalysis);
        console.log('saved interview analysis to DB');

        res.status(HttpStatusCode.Ok).send({ analysis: interviewAnalysis });
    } catch (error) {
        console.error('Error during interview analysis request:', error);
        res.status(HttpStatusCode.InternalServerError).send({ error: 'Internal Server Error' });
    }
});

interviewRouter.get('/preparation/:interviewId', getInterviewPreparation);
