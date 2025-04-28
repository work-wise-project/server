import FormData from 'form-data';
import { axiosInstance } from './axiosInstance';
import { AxiosHeaderValue } from 'axios';

const uploadResume = async (file: Express.Multer.File, userId: string): Promise<void> => {
    try {
        const formData = new FormData();

        formData.append('resume', file.buffer, userId);

        formData.append('mimeType', file.mimetype);

        const response = await axiosInstance.post('/resume', formData, {
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
): Promise<{ fileBuffer: Buffer; contentType: AxiosHeaderValue | undefined }> => {
    try {
        const response = await axiosInstance.get(`/resume/${userId}`, {
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

export { uploadResume, getResume };
