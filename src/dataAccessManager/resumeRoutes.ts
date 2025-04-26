import FormData from 'form-data';
import { axiosInstance } from './axiosInstance';

const uploadResume = async (file: Express.Multer.File, userId: string): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('resume', file.buffer, userId);

        await axiosInstance.post('/resume', formData, {
            headers: formData.getHeaders(),
        });
    } catch (error) {
        console.error('Axios error:', error);
        throw new Error('Failed to upload resume from data-access-manager');
    }
};

export { uploadResume };
