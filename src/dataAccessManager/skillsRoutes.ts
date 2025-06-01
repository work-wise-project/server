import { ISkill } from '../types/ISkill';
import { dataAccessAxios } from './axiosInstance';

const getAllSkills = async (): Promise<Array<ISkill>> => {
    try {
        const response = await dataAccessAxios.get('/skills');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch skills from data-access-manager');
    }
};

const addSkills = async (): Promise<Array<ISkill>> => {
    try {
        const response = await dataAccessAxios.post('/skills');
        return response.data;
    } catch (error) {
        throw new Error('Failed to add skills from data-access-manager');
    }
};

export { addSkills, getAllSkills };
