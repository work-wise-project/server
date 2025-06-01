import { InterviewPreparationData } from '../types/IPreparation';
import { llmAxiosInstance } from './axiosInstance';

const generateInterviewPreparation = async (interviewPreparationData: InterviewPreparationData): Promise<string> => {
    try {
        const res = await llmAxiosInstance.post('/interviews/preparation', interviewPreparationData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.error ?? 'Failed to fetch interview preparation from LLM service');
    }
};

export default { generateInterviewPreparation };
