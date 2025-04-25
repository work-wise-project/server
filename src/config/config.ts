import { config as configDotenv } from 'dotenv';

type Config = {
    env: 'development' | 'production';
    port: number;
    tokenSecret: string;
    tokenExpires: string;
    refreshTokenExpires: string;
    domainBase: string;
    googleClientId: string;
    allowedOrigins: string;
    dataAccessManagerUrl: string;
    sttServiceUrl: string;
    llmServiceUrl: string;
};

const REQUIRED_ENVIRONMENT_VARIABLES = [
    'TOKEN_SECRET',
    'DOMAIN_BASE',
    'GOOGLE_CLIENT_ID',
    'ALLOWED_ORIGINS',
    'DATA_ACCESS_MANAGER_URL',
    'STT_SERVICE_URL',
    'LLM_SERVICE_URL',
];

const checkEnvironmentVariables = () => {
    if (REQUIRED_ENVIRONMENT_VARIABLES.some((variable) => !(variable in process.env))) {
        const missingVariables = REQUIRED_ENVIRONMENT_VARIABLES.find((variable) => !(variable in process.env));
        throw new Error(`missing environment variable: ${missingVariables}`);
    }
};

let config: Config;

export const getConfig = () => {
    if (!config) {
        configDotenv();
        checkEnvironmentVariables();

        const { env } = process as { env: Record<string, string> };

        config = {
            env: env.NODE_ENV === 'production' ? env.NODE_ENV : 'development',
            port: Number(env.PORT) || 3000,
            allowedOrigins: env.ALLOWED_ORIGINS,
            tokenSecret: env.TOKEN_SECRET,
            tokenExpires: env.TOKEN_EXPIRES || '300s',
            refreshTokenExpires: env.REFRESH_TOKEN_EXPIRES || '7d',
            domainBase: env.DOMAIN_BASE,
            googleClientId: env.GOOGLE_CLIENT_ID,
            dataAccessManagerUrl: env.DATA_ACCESS_MANAGER_URL,
            sttServiceUrl: env.STT_SERVICE_URL,
            llmServiceUrl: env.LLM_SERVICE_URL,
        };
    }

    return config;
};
