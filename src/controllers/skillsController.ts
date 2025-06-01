import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import dataAccessManagerInstance from '../dataAccessManager';

export const getAllSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await dataAccessManagerInstance.getAllSkills();
        res.status(status.OK).send(user);
    } catch (error) {
        next(error);
    }
};
