import dataAccessManagerInstance from '../dataAccessManager';
import { IUserDocument } from '../types/IUserDocument';
import { generateTokens } from './generateTokens';

export const generateAndSaveUser = async (user: IUserDocument) => {
    try {
        const tokens = generateTokens(user.id);

        if (!tokens) {
            throw new Error('Token secret is not configured');
        }
        const { accessToken, refreshToken } = tokens;

        if (!user.refreshToken) {
            user.refreshToken = [];
        }

        user.refreshToken.push(tokens.refreshToken);

        await dataAccessManagerInstance.updateUser(user);

        return { accessToken, refreshToken, user };
    } catch (error) {
        throw error;
    }
};
