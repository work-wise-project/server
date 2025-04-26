import { IUser } from '../types/IUser';
import { axiosInstance } from './axiosInstance'; // Import your pre-configured Axios instance

const getUserByEmail = async (email: string): Promise<IUser> => {
    try {
        const response = await axiosInstance.get(`/users`, { params: { email } });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user from data-access-manager');
    }
};

const getUserById = async (id: string): Promise<IUser> => {
    try {
        const response = await axiosInstance.get(`/users`, { params: { id } });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user from data-access-manager');
    }
};

const createUser = async (userData: IUser) => {
    try {
        const response = await axiosInstance.post('/users', userData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create user in data-access-manager');
    }
};

const updateUser = async (userData: IUser): Promise<IUser> => {
    try {
        const response = await axiosInstance.put(`/users/${userData.id}`, userData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update user in data-access-manager');
    }
};

export { getUserByEmail, getUserById, createUser, updateUser };
