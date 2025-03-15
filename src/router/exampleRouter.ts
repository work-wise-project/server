import { Router } from 'express';
import { asyncHandler } from '../errors/asyncHandler';

export const example = Router();

example.get(
    '/',
    asyncHandler(async (req, res) => {
        res.status(200).send('Hello World');
    })
);
