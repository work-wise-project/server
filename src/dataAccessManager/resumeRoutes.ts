import FormData from 'form-data';
import { ResumeContentType } from '../types/ResumeContentType';
import { dataAccessAxios } from './axiosInstance';
import { IResumeAnalysisResult, IResumeFromDatabase } from '../types/IResumeAnalysisResult';

const uploadResume = async (file: Express.Multer.File, userId: string): Promise<void> => {
    try {
        const formData = new FormData();

        formData.append('resume', file.buffer, userId);

        formData.append('mimeType', file.mimetype);

        const response = await dataAccessAxios.post('/resume', formData, {
            headers: formData.getHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to upload resume from data-access-manager');
    }
};

const getResume = async (
    userId: string
): Promise<{ fileBuffer: Buffer; contentType: ResumeContentType | undefined }> => {
    try {
        const response = await dataAccessAxios.get(`/resume/${userId}`, {
            responseType: 'arraybuffer',
        });

        const fileBuffer = response.data;
        const contentType = response.headers['content-type'];

        return { fileBuffer, contentType };
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to upload resume from data-access-manager');
    }
};

const getResumeAnalysis = async (userId: string): Promise<IResumeFromDatabase> => {
    try {
        const response = await dataAccessAxios.get(`/resume/analysis/${userId}`, {
            responseType: 'json',
        });

        const analysis = response.data;
        console.log('Resume analysis:', analysis);

        return analysis;
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to get resume analysis from data-access-manager');
    }
};

const getResumeSpellCheck = async (userId: string): Promise<IResumeFromDatabase> => {
    try {
        const response = await dataAccessAxios.get(`/resume/spellcheck/${userId}`, {
            responseType: 'json',
        });

        const spellCheck = response.data;
        console.log('Resume spell check:', spellCheck);

        return spellCheck;
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to get resume spell check from data-access-manager');
    }
};

const saveResumeAnalysis = async (userId: string, analysis: IResumeAnalysisResult): Promise<void> => {
    try {
        const analysisWithLink = {
            userId,
            analysis,
        };
        console.log(typeof analysis === 'string');
        const response = await dataAccessAxios.post(`/resume/analysis`, analysisWithLink);

        console.log('Resume analysis saved:', response.data);
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to save resume analysis from data-access-manager');
    }
};

const saveResumeSpellCheck = async (userId: string, spellCheck: string): Promise<void> => {
    try {
        const spellCheckWithLink = {
            userId,
            spellCheck,
        };
        const response = await dataAccessAxios.post(`/resume/spellcheck`, spellCheckWithLink);

        console.log('Resume spell check saved:', response.data);
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to save resume spell check from data-access-manager');
    }
};

export { getResume, uploadResume, getResumeAnalysis, getResumeSpellCheck, saveResumeAnalysis, saveResumeSpellCheck };
