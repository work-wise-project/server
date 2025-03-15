import { config as configDotenv } from "dotenv";

type Config = {
  env: "development" | "production";
  port: number;
};

// const REQUIRED_ENVIRONMENT_VARIABLES = [];

// const checkEnvironmentVariables = () => {
//   if (
//     REQUIRED_ENVIRONMENT_VARIABLES.some(
//       (variable) => !(variable in process.env)
//     )
//   ) {
//     const missingVariables = REQUIRED_ENVIRONMENT_VARIABLES.find(
//       (variable) => !(variable in process.env)
//     );
//     throw new Error(`missing environment variable: ${missingVariables}`);
//   }
// };

let config: Config;

export const getConfig = () => {
  if (!config) {
    configDotenv();
    // checkEnvironmentVariables();

    const { env } = process as { env: Record<string, string> };

    config = {
      env: env.NODE_ENV === "production" ? env.NODE_ENV : "development",
      port: Number(env.PORT) || 3000,
    };
  }

  return config;
};
