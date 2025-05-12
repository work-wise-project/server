import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import dataAccessManagerInstance from '../dataAccessManager';
import llmServiceInstance from '../llmService/interviewRoutes';

export const getInterviewPreparation = async (req: Request, res: Response): Promise<void> => {
    const { interviewId } = req.params;
    if (!interviewId) {
        res.status(HttpStatusCode.BadRequest).send({ error: 'Interview id is required' });
        return;
    }

    try {
        const response = await dataAccessManagerInstance.getInterviewPreparation(interviewId);
        res.status(HttpStatusCode.Ok).send(response.data);
    } catch (error: any) {
        if (error.response?.status === HttpStatusCode.NotFound) {
            try {
                const interview = await dataAccessManagerInstance.getInterviewById(interviewId);
                const preparationResult = await llmServiceInstance.generateInterviewPreparation(interview.job_link);
                console.log('finished preparation');

                await dataAccessManagerInstance.saveInterviewPreparation(preparationResult);
                console.log('saved interview preparation to DB');

                res.status(HttpStatusCode.Ok).send(preparationResult);
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
