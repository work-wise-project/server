import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { getConfig } from './config/config';
import dataManagerProxyRouter from './dataAccessManager/proxyRouter';
import { errorHandler } from './middlewares';
import { authMiddleware } from './middlewares/authMiddleware';
import { authRouter, interviewRouter, resumeRouter, skillsRouter, usersRouter } from './router';

dotenv.config();

const app = express();
const { port, env } = getConfig();

const allowedOrigins = [process.env.ALLOWED_ORIGINS];
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
app.use('/auth', authRouter);
app.use('/datamanager/proxy', authMiddleware, dataManagerProxyRouter);
app.use('/users', authMiddleware, usersRouter);
app.use('/resume', resumeRouter);
app.use('/skills', skillsRouter);
app.use('/uploads', express.static('uploads'));
app.use('/interviews', interviewRouter);

// Middlewares
app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
