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

        const resumePublicUrl = await dataAccessManagerInstance.uploadResume(req.file, userId);
        res.status(status.OK).json(resumePublicUrl);
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error });
    }
};

export const getResumeText = async (userId: string): Promise<string | null> => {
    if (!userId) {
        throw new Error('No userId provided');
    }

    const { fileBuffer, contentType } = await dataAccessManagerInstance.getResume(userId);

    if (!fileBuffer || !contentType) {
        return null;
    }

    if (contentType === 'application/pdf') {
        return extractTextFromPDF(fileBuffer);
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return extractTextFromDocx(fileBuffer);
    } else if (contentType === 'text/plain; charset=utf-8') {
        return extractTextFromTxt(fileBuffer);
    } else {
        throw new Error('Unsupported file format');
    }
};

export const getResumeIfExist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const textContent = await getResumeText(userId);

        res.status(status.OK).send(textContent);
    } catch (error) {
        console.error('Error getting resume:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch resume' });
    }
};

export const analyzeOrCheckResume = (isAnalyze: boolean) => async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const textContent = await getResumeText(userId);
        if (textContent) {
            if (isAnalyze) {
                const result = await llmServiceInstance.processAnalyzeResume(textContent);
                res.json(result);
                return;
            } else {
                const result = await llmServiceInstance.processResumeSpellCheck(textContent);
                res.json(result);
                return;
            }
        } else {
            throw new Error('Resume does not exist');
        }
    } catch (error) {
        console.error('Error processing resume:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Failed to process resume' });
    }
};
