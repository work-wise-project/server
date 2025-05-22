import dataAccessManagerInstance from '../dataAccessManager';
import { IUser } from '../types/IUser';
import { generateTokens } from './generateTokens';

export const generateAndSaveUser = async (user: IUser) => {
    try {
        const tokens = generateTokens(user.id);

        if (!tokens) {
            throw new Error('Token secret is not configured');
        }
        const { accessToken, refreshToken } = tokens;

        if (!user.refresh_tokens) {
            user.refresh_tokens = [];
        }

        user.refresh_tokens.push(tokens.refreshToken);

        await dataAccessManagerInstance.updateUser(user);

        return { accessToken, refreshToken, user };
    } catch (error) {
        throw error;
    }
};
