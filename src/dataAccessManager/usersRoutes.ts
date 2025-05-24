import { IUser } from '../types/IUser';
import { dataAccessAxios } from './axiosInstance';

const getUserByEmail = async (email: string): Promise<IUser> => {
    try {
        const response = await dataAccessAxios.get(`/users`, { params: { email } });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user from data-access-manager');
    }
};

const getUserById = async (id: string): Promise<IUser> => {
    try {
        const response = await dataAccessAxios.get(`/users`, { params: { id } });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user from data-access-manager');
    }
};

const createUser = async (userData: Omit<IUser, 'id'>) => {
    try {
        const response = await dataAccessAxios.post('/users', userData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create user in data-access-manager');
    }
};

const updateUser = async (userData: IUser): Promise<IUser> => {
    try {
        const response = await dataAccessAxios.put(`/users/${userData.id}`, userData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update user in data-access-manager');
    }
};

export { getUserByEmail, getUserById, createUser, updateUser };
