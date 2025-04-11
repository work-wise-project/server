import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUserDocument } from '../types/IUserDocument';
import dataAccessManagerInstance from '../dataAccessManager/usersRoutes';
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
            user.refresh_tokens = [];
            await dataAccessManagerInstance.updateUser(user);
            throw new Error('Refresh token does not match');
        }

        // remove the used refresh token
        user.refresh_tokens = user.refresh_tokens.filter((token) => token !== refreshToken);

        await dataAccessManagerInstance.updateUser(user);
        return user;
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Invalid refresh token');
    }
};
