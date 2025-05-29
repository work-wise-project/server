import { config as configDotenv } from 'dotenv';

type Config = {
    isProductionEnv: boolean;
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
    httpsKey: string;
    httpsCert: string;
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

const checkEnvironmentVariables = (requiredEnvironmentVariables: string[]) => {
    if (requiredEnvironmentVariables.some((variable) => !(variable in process.env))) {
        const missingVariables = requiredEnvironmentVariables.find((variable) => !(variable in process.env));
        throw new Error(`missing environment variable: ${missingVariables}`);
    }
};

let config: Config;

export const getConfig = () => {
    if (!config) {
        configDotenv();

        const { env } = process as { env: Record<string, string> };
        const isProductionEnv = env.NODE_ENV === 'production';

        checkEnvironmentVariables([
            ...REQUIRED_ENVIRONMENT_VARIABLES,
            ...(isProductionEnv ? ['HTTPS_KEY', 'HTTPS_CERT'] : []),
        ]);

        config = {
            isProductionEnv,
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
            httpsKey: env.HTTPS_KEY || '',
            httpsCert: env.HTTPS_CERT || '',
        };
    }

    return config;
};
