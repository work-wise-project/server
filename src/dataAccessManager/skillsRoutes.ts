import { ISkill } from '../types/ISkill';
import { axiosInstance } from './axiosInstance';

const getAllSkills = async (): Promise<Array<ISkill>> => {
    try {
        const response = await axiosInstance.get('/skills');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch skills from data-access-manager');
    }
};

export { getAllSkills };
