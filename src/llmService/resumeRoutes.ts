import { ResumeAnalysisWithSpellCheck } from '../types/IResumeAnalysisResult';
import { llmAxiosInstance } from './axiosInstance';

const processAnalyzeResume = async (resumeText: string) => {
    try {
        const response = await llmAxiosInstance.post('/resume/analyze-resume', { resumeText });
        return response.data;
    } catch (error: any) {
        throw new Error(error.error ?? 'Failed to analyze resume text in LLM service');
    }
};

const processResumeSpellCheck = async (resumeText: string) => {
    try {
        const response = await llmAxiosInstance.post('/resume/check-grammar', { resumeText });
        return response.data;
    } catch (error: any) {
        throw new Error(error.error ?? 'Failed to process resume text in LLM service');
    }
};

export default { processAnalyzeResume, processResumeSpellCheck };
