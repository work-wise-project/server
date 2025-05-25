import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUserDocument } from '../types/IUserDocument';
import dataAccessManagerInstance from '../dataAccessManager';
import { IUser } from '../types/IUser';

export const verifyRefreshToken = async (refreshToken: string | undefined): Promise<IUserDocument> => {
    if (!refreshToken) {
        throw new Error('Refresh token is missing');
    }

    if (!process.env.TOKEN_SECRET) {
        throw new Error('Token secret is not configured');
    }

    try {
        const payload: JwtPayload = jwt.verify(refreshToken, process.env.TOKEN_SECRET) as JwtPayload;

        const userId = payload._id;
        if (!userId) {
            throw new Error('Invalid refresh token');
        }

        const user: IUser = await dataAccessManagerInstance.getUserById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.refresh_tokens || !user.refresh_tokens.includes(refreshToken)) {
            await dataAccessManagerInstance.updateRefreshTokensUser(userId, []);
            throw new Error('Refresh token does not match');
        }

        // remove the used refresh token
        const refresh_tokens = user.refresh_tokens.filter((token) => token !== refreshToken);

        await dataAccessManagerInstance.updateRefreshTokensUser(userId, refresh_tokens);
        return user;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Invalid refresh token');
    }
};
