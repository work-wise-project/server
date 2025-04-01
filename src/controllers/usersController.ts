import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import dataAccessManagerInstance from '../dataAccessManager/usersRoutes';

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        if (id) {
            const user = await dataAccessManagerInstance.getUserById(id.toString());
            res.status(status.OK).send(user);
        } else {
            throw new Error('Not supplied id');
        }
    } catch (error) {
        next(error);
    }
};
