import { Request, Response } from 'express';
import status from 'http-status';
// import userModel, { IUser } from '../../models/usersModel';
import { IUser } from '../types/IUser';
import { ServerException } from '../errors/ServerException';
import { googleLogin } from '../utils/googleLogin';
import { verifyRefreshToken } from '../utils/verifyRefreshToken';
import { generateAndSaveUser } from '../utils/generateTokenAndSave';

// export const register = async (req: Request, res: Response) => {
//   try {
//     const email = req.body.email;
//     const profileImage = req.body.profileImage;

//     const username = req.body.username;

//     const existingUsername = await userModel.findOne({ username });

//     if (existingUsername) {
//       res.status(status.BAD_REQUEST).send('Username already exists');
//       return;
//     }

//     const password = req.body.password;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const user = await userModel.create({
//       email,
//       username,
//       profileImage,
//       password: hashedPassword,
//     });

//     res.status(status.OK).send(user);
//   } catch (error) {
//     res.status(status.BAD_REQUEST).send(error);
//   }
// };

export const login = async (req: Request, res: Response) => {
    console.log('login', req.body);
    try {
        if (!process.env.TOKEN_SECRET) {
            res.status(status.BAD_REQUEST).send('Token secret is not configured');
            return;
        }

        const userWithTokens = await googleLogin(req, res);

        res.status(status.OK).send(userWithTokens);
    } catch (error) {
        if (error instanceof ServerException) {
            res.status(error.status).send({
                error: error.message,
            });
            return;
        }
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        res.status(status.BAD_REQUEST).send(errorMessage);
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        await user.save();
        res.status(status.OK).send({ _id: user.id });
    } catch (error) {
        if (error instanceof Error) {
            res.status(status.BAD_REQUEST).send(error.message);
            return;
        }
        res.status(status.BAD_REQUEST).send('An unexpected error occurred');
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(status.BAD_REQUEST).send('Invalid refresh token');
            return;
        }

        const userWithTokens = await generateAndSaveUser(user);

        res.status(status.OK).send(userWithTokens);
    } catch (error) {
        if (error instanceof ServerException) {
            res.status(error.status).send({
                error: error.message,
            });
            return;
        }
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        res.status(status.BAD_REQUEST).send(errorMessage);
    }
};
