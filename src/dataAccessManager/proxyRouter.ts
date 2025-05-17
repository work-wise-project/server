import express from 'express';
import { dataAccessAxios } from './axiosInstance';
import qs from 'qs';

const proxyRouter = express.Router();

proxyRouter.use(async (req, res) => {
    const { host, 'content-length': _, ...safeHeaders } = req.headers;

    console.log('Proxying request to DataManager:', req.method, req.path, req.query, req.body);
    const pathToProxy = req.path;
    const queryString = qs.stringify(req.query);
    const fullUrl = queryString ? `${pathToProxy}?${queryString}` : pathToProxy;

    try {
        const response = await dataAccessAxios({
            method: req.method,
            url: fullUrl,
            params: req.params,
            data: req.body,
            headers: safeHeaders,
        });

        res.status(response.status).send(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const responseData = error.response?.data || {};

        res.status(status).send({
            error: responseData.message || 'An error occurred',
            details: responseData,
        });
    }
});

export default proxyRouter;
