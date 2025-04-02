import { ResumeAnalysisResult } from '../types/IResumeAnalysisResult';
import { llmAxiosInstance } from './axiosInstance';

const processResumeText = async (resumeText: string): Promise<ResumeAnalysisResult> => {
    console.log(resumeText);
    try {
        const response = await llmAxiosInstance.post('/resume/process-resume', { resumeText });
        return response.data;
    } catch (error: any) {
        throw new Error(error.error ?? 'Failed to process resume text in LLM service');
    }
};

export default { processResumeText };
