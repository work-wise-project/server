import status from 'http-status';
import axios from 'axios';
import { Request, Response } from 'express';
import llmServiceInstance from '../llmService/resumeRoutes';
import { extractTextFromDocx, extractTextFromPDF, extractTextFromTxt } from '../utils/fileExtraction';
import dataAccessManagerInstance from '../dataAccessManager';

export const uploadResume = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        await dataAccessManagerInstance.uploadResume(req.file, userId);
        res.status(status.OK).json({ message: 'Resume uploaded successfully' });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
    }
};

export const analyzeOrCheckResume = (isAnalyze: boolean) => async (req: Request, res: Response) => {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
            res.status(status.BAD_REQUEST).json({ error: 'No file URL provided' });
            return;
        }

        // Download the file from the provided URL
        const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'arraybuffer',
        });

        const fileBuffer = response.data;

        let textContent: string;

        const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

        if (fileExtension === 'pdf') {
            textContent = await extractTextFromPDF(fileBuffer);
        } else if (fileExtension === 'docx') {
            textContent = await extractTextFromDocx(fileBuffer);
        } else if (fileExtension === 'txt') {
            textContent = await extractTextFromTxt(fileBuffer);
        } else {
            res.status(status.BAD_REQUEST).json({ error: 'Unsupported file format' });
            return;
        }

        if (isAnalyze) {
            const result = await llmServiceInstance.processAnalyzeResume(textContent);
            res.json(result);
            return;
        } else {
            const result = await llmServiceInstance.processResumeSpellCheck(textContent);
            res.json(result);
            return;
        }
    } catch (error) {
        console.error('Error processing resume:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Failed to process resume' });
    }
};
