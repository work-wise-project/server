import axios from 'axios';
import { getConfig } from '../config';

export const llmAxiosInstance = axios.create({
    baseURL: getConfig().llmServiceUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});
