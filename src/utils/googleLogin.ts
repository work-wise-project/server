import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { generateAndSaveUser } from './generateTokenAndSave';
import { ServerException } from '../errors/ServerException';
import { IUser } from '../types/IUser';

const client = new OAuth2Client();

export const googleLogin = async (req: Request, res: Response) => {
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
        console.log('payloaddddddd', payload);

        const email = payload?.email;
        //  = await userModel.findOne({ email });
        let user;
        if (!user) {
            user = {
                email,
                profileImage: payload?.picture,
                name: payload?.name,
            };
        }

        return await generateAndSaveUser(user);
    } catch (error) {
        console.log('errorrrrrrrrrrrrrrr', error);
        if (!error) {
            throw new ServerException();
        }
        throw error;
    }
};
