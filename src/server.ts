import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { getConfig } from './config/config';
import { errorHandler } from './middlewares';
import { example } from './router';

dotenv.config();

const app = express();
const { port, env } = getConfig();

// Middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

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
app.use('/example', example);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
