import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import dataAccessManagerInstance from '../dataAccessManager';

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

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        if (id) {
            const user = await dataAccessManagerInstance.updateUser({ id: id.toString(), ...req.body });
            res.status(status.OK).send(user);
        } else {
            throw new Error('Not supplied id');
        }
    } catch (error) {
        next(error);
    }
};
