import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { getConfig } from './config/config';
import { errorHandler } from './middlewares';
import { authMiddleware } from './middlewares/authMiddleware';
import { interviewRouter, resumeRouter } from './router';
import authRoute from './router/authRoute';
import usersRoute from './router/usersRoute';
import dataManagerProxyRouter from './dataAccessManager/proxyRouter';

dotenv.config();

const app = express();
const { port, env } = getConfig();

// Middlewares

const allowedOrigins = ['http://localhost:5173'];
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        maxAge: 600,
    })
);
app.use(express.json());

if (env === 'development') {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Workwise API',
                version: '1.0.0',
                description: 'REST server including authentication using JWT',
            },
            servers: [{ url: `http://localhost:${port}` }],
        },
        apis: ['./src/docs/*.ts'],
    };
    const specs = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
}

// Routes
app.use('/auth', authRoute);
app.use('/datamanager/proxy', authMiddleware, dataManagerProxyRouter);
app.use('/users', authMiddleware, usersRoute);
app.use('/resume', resumeRouter);
app.use('/uploads', express.static('uploads'));
app.use('/interviews', interviewRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
