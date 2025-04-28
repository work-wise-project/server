import jwt from 'jsonwebtoken';
import { ITokens } from '../types/ITokens';
import { getConfig } from '../config/config';

export const generateTokens = (userId: string): ITokens | null => {
    try {
        if (!process.env.TOKEN_SECRET) {
            return null;
        }
        const random = Math.random().toString();
        const accessToken = jwt.sign(
            {
                _id: userId,
                random,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: getConfig().tokenExpires }
        );

        const refreshToken = jwt.sign(
            {
                _id: userId,
                random,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: getConfig().refreshTokenExpires }
        );
        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};
