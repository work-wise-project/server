import { Request, Response } from 'express';
import status from 'http-status';
import dataAccessManagerInstance from '../dataAccessManager';
import llmServiceInstance from '../llmService/resumeRoutes';
import { ResumeContentType } from '../types/ResumeContentType';
import { extractTextFromDocx, extractTextFromPDF, extractTextFromTxt } from '../utils/fileExtraction';

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

export const getResumeText = async (
    userId: string
): Promise<{ textContent: string; contentType: keyof typeof ResumeContentType | undefined } | null> => {
    if (!userId) {
        throw new Error('No userId provided');
    }

    const { fileBuffer, contentType } = await dataAccessManagerInstance.getResume(userId);

    if (!fileBuffer || !contentType) {
        return null;
    }

    const extractors: Record<ResumeContentType, (buffer: Buffer) => Promise<string>> = {
        [ResumeContentType.pdf]: extractTextFromPDF,
        [ResumeContentType.docx]: extractTextFromDocx,
        [ResumeContentType.txt]: extractTextFromTxt,
    };

    const extractor = extractors[contentType];
    if (!extractor) {
        throw new Error('Unsupported file format');
    }

    const textContent = await extractor(fileBuffer);
    const shortType = (Object.keys(ResumeContentType) as (keyof typeof ResumeContentType)[]).find(
        (key) => ResumeContentType[key] === contentType
    );
    return { textContent, contentType: shortType };
};

export const getResumeIfExist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const resumeData = await getResumeText(userId);

        res.status(status.OK).send(resumeData);
    } catch (error) {
        console.error('Error getting resume:', error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch resume' });
    }
};

export const analyzeOrCheckResume = (isAnalyze: boolean) => async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const resumeData = await getResumeText(userId);
        if (resumeData) {
            if (isAnalyze) {
                const result = await llmServiceInstance.processAnalyzeResume(resumeData.textContent);
                res.json(result);
                return;
            } else {
                const result = await llmServiceInstance.processResumeSpellCheck(resumeData.textContent);
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
