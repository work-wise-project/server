import { llmAxiosInstance } from './axiosInstance';

const generateInterviewPreparation = async (jobLink: string): Promise<string> => {
    try {
        const res = await llmAxiosInstance.post('/interviews/preparation', { jobLink });
        return res.data;
    } catch (error: any) {
        throw new Error(error.error ?? 'Failed to fetch interview preparation from LLM service');
    }
};

export default { generateInterviewPreparation };
