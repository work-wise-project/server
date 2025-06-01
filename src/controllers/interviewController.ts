import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import dataAccessManagerInstance from '../dataAccessManager';
import llmServiceInstance from '../llmService/interviewRoutes';
import { AuthRequest } from '../middlewares/authMiddleware';
import { IPreparationResult } from '../types/IPreparation';
import { getResumeText } from './resumeController';

export const getInterviewPreparation = async (req: AuthRequest, res: Response): Promise<void> => {
    const { interviewId } = req.params;
    if (!interviewId) {
        res.status(HttpStatusCode.BadRequest).send({ error: 'Interview id is required' });
        return;
    }

    try {
        const response = await dataAccessManagerInstance.getInterviewPreparation(interviewId);
        res.status(HttpStatusCode.Ok).send(response);
    } catch (error: any) {
        if (error.response?.status === HttpStatusCode.NotFound) {
            try {
                const [interviewPreparationData, resumeDetails] = await Promise.all([
                    dataAccessManagerInstance.getInterviewPreparationData(interviewId),
                    getResumeText(req.currentUser.id),
                ]);
                const preparationResult = await llmServiceInstance.generateInterviewPreparation({
                    ...interviewPreparationData,
                    resumeText: resumeDetails?.textContent,
                });
                const preparationData: IPreparationResult = {
                    interview_id: interviewId,
                    ...JSON.parse(preparationResult),
                };

                await dataAccessManagerInstance.saveInterviewPreparation(preparationData);

                res.status(HttpStatusCode.Ok).send(preparationData);
            } catch (innerError) {
                console.error('Error generating preparation:', innerError);
                res.status(HttpStatusCode.InternalServerError).send({
                    error: 'Failed to generate interview preparation',
                });
                return;
            }
        } else {
            console.error('Error fetching preparation:', error);
            res.status(HttpStatusCode.InternalServerError).send({
                error: 'Failed to fetch or generate preparation',
            });
            return;
        }
    }
};
