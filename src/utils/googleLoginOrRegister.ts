import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import status from 'http-status';

import { generateAndSaveUser } from './generateTokenAndSave';
import dataAccessManagerInstance from '../dataAccessManager';
import { ApiError } from '../errors/ApiError';

const client = new OAuth2Client();

export const googleLoginOrRegister = async (req: Request, res: Response, isLogin = false) => {
    try {
        const credential = req.body?.credential;

        if (!credential) {
            throw new Error('Error missing credential');
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const email = payload?.email;
        if (email) {
            let user = await dataAccessManagerInstance.getUserByEmail(email);
            if (isLogin) {
                if (!user) {
                    throw new ApiError({ message: 'User does not exist', status: status.BAD_REQUEST });
                }
            } else {
                if (user) {
                    throw new ApiError({ message: 'Email is already exists', status: status.BAD_REQUEST });
                } else {
                    user = await dataAccessManagerInstance.createUser({
                        email,
                        name: payload?.name || 'unknown',
                    });
                }
            }
            return await generateAndSaveUser(user);
        }
    } catch (error) {
        throw error;
    }
};
