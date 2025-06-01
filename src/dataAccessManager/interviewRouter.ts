import { InterviewPreparationData, IPreparationResult } from '../types/IPreparation';
import { dataAccessAxios } from './axiosInstance';

const getInterviewPreparationData = async (
    interviewId: string
): Promise<Omit<InterviewPreparationData, 'resumeText'>> => {
    try {
        const { data } = await dataAccessAxios.get(`/interviews/preparation-data?id=${interviewId}`);
        return data;
    } catch (error) {
        throw new Error('Failed to fetch interview from data-access-manager');
    }
};

const getInterviewPreparation = async (interviewId: string): Promise<IPreparationResult> => {
    try {
        const response = await dataAccessAxios.get(`/interviews/preparation/${interviewId}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw error;
        } else {
            throw new Error('Failed to fetch interview preparation from data-access-manager');
        }
    }
};

const saveInterviewPreparation = async (preparationResult: IPreparationResult) => {
    try {
        await dataAccessAxios.post('/interviews/preparation', preparationResult);
    } catch (error) {
        throw new Error('Failed to save interview preparation to data-access-manager');
    }
};

export { getInterviewPreparationData, getInterviewPreparation, saveInterviewPreparation };
