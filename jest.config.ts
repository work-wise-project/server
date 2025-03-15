import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest', // Use ts-jest preset for TypeScript support
    testEnvironment: 'node', // Set the test environment to Node.js
    setupFilesAfterEnv: ['./src/tests/setupTests.ts'], // Path to your test setup file
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files using ts-jest
    },
    transformIgnorePatterns: [
        'node_modules/(?!.*\\.mjs$)', // Allow transforming ESM modules if necessary
    ],
    maxWorkers: 1,
};

export default config;
