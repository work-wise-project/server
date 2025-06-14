import { Request, Response } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import status from 'http-status';

import dataAccessManagerInstance from '../dataAccessManager';
import { ApiError } from '../errors/ApiError';
import { generateAndSaveUser } from './generateTokenAndSave';

const client = new OAuth2Client();

type GooglePayloadWithEmail = TokenPayload & { email: string };

const getGooglePayloadOrThrow = async (credential: string): Promise<GooglePayloadWithEmail> => {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (!email) {
        throw new ApiError({ message: 'Email not found in Google payload', status: status.BAD_REQUEST });
    }
    return { ...payload, email };
};

export const ensureGoogleEmailNotRegistered = async (credential: string): Promise<GooglePayloadWithEmail> => {
    const payload = await getGooglePayloadOrThrow(credential);
    const email = payload.email;
    const user = await dataAccessManagerInstance.getUserByEmail(email);
    if (user) {
        throw new ApiError({ message: 'Email already exists', status: status.BAD_REQUEST });
    }
    return payload;
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const credential = req.body?.credential;
        if (!credential) {
            throw new ApiError({ message: 'Missing credential', status: status.BAD_REQUEST });
        }
        const payload = await getGooglePayloadOrThrow(credential);
        const user = await dataAccessManagerInstance.getUserByEmail(payload.email);
        if (!user) {
            throw new ApiError({ message: 'User does not exist', status: status.BAD_REQUEST });
        }
        return await generateAndSaveUser(user);
    } catch (error) {
        throw error;
    }
};

export const googleRegister = async (req: Request, res: Response) => {
    try {
        const credential = req.body?.googleCredential;
        if (!credential) {
            throw new ApiError({ message: 'Missing credential', status: status.BAD_REQUEST });
        }
        const payload = await ensureGoogleEmailNotRegistered(credential);
        const user = await dataAccessManagerInstance.createUser({
            email: payload.email,
            name: payload.name || 'unknown',
            ...req.body?.userData,
        });
        return await generateAndSaveUser(user);
    } catch (error) {
        throw error;
    }
};
