import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { generateAndSaveUser } from '../utils/generateTokenAndSave';
import { ensureGoogleEmailNotRegistered, googleLogin, googleRegister } from '../utils/googleLoginOrRegister';
import { verifyRefreshToken } from '../utils/verifyRefreshToken';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userWithTokens = await googleRegister(req, res);

        res.status(status.OK).send(userWithTokens);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!process.env.TOKEN_SECRET) {
            res.status(status.BAD_REQUEST).send('Token secret is not configured');
            return;
        }

        const userWithTokens = await googleLogin(req, res);

        res.status(status.OK).send(userWithTokens);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);

        res.status(status.OK).send({ _id: user.id });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(status.BAD_REQUEST).send('Invalid refresh token');
            return;
        }

        const userWithTokens = await generateAndSaveUser(user);

        res.status(status.OK).send(userWithTokens);
    } catch (error) {
        next(error);
    }
};

export const getAndVerifyGoogleCredential = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const credential = req.body?.credential;
        if (!credential) {
            res.status(status.BAD_REQUEST).send('Missing credential');
            return;
        }
        const payload = await ensureGoogleEmailNotRegistered(credential);
        res.status(status.OK).send(payload);
    } catch (error) {
        next(error);
    }
};
