import axios from 'axios';

export const llmAxiosInstance = axios.create({
    baseURL: 'http://localhost:4002',
    headers: {
        'Content-Type': 'application/json',
    },
});
