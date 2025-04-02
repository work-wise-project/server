import status from 'http-status';
import fs from 'fs';
import { Request, Response } from 'express';
import llmServiceInstance from '../llmService/resumeRoutes';
import { extractTextFromDocx, extractTextFromPDF, extractTextFromTxt } from '../utils/fileExtraction';

export const updloadResumeToLlm = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(status.BAD_REQUEST).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;
        let textContent: string;

        if (req.file.mimetype === 'application/pdf') {
            textContent = await extractTextFromPDF(filePath);
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            textContent = await extractTextFromDocx(filePath);
        } else if (req.file.mimetype === 'text/plain') {
            textContent = await extractTextFromTxt(filePath);
        } else {
            res.status(status.BAD_REQUEST).json({ error: 'Unsupported file format' });
            return;
        }

        fs.unlinkSync(filePath); // Cleanup uploaded file
        const result = await llmServiceInstance.processResumeText(textContent);
        res.json(result);
    } catch (error) {
        console.error('Error processing resume:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Failed to process resume' });
    }
};
