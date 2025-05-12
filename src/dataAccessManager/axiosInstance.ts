import axios from 'axios';
import { getConfig } from '../config/config';

export const dataAccessAxios = axios.create({
    baseURL: getConfig().dataAccessManagerUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});
