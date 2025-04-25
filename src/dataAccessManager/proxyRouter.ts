// server/src/routes/datamanagerProxy.ts
import express from 'express';
import { axiosInstance } from './axiosInstance';
import qs from 'qs';

const proxyRouter = express.Router();

proxyRouter.use('*', async (req, res) => {
    const pathToProxy = req.path;
    const queryString = qs.stringify(req.query);
    const fullUrl = queryString ? `${pathToProxy}?${queryString}` : pathToProxy;

    try {
        const response = await axiosInstance({
            method: req.method,
            url: fullUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: undefined, // clear host to avoid issues
            },
        });

        res.status(response.status).send(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        res.status(status).send({
            error: error.message,
            details: error.response?.data,
        });
    }
});

export default proxyRouter;
