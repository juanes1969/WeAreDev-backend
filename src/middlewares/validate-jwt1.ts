import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Config } from '../utils';

interface JwtPayload {
    data: Request
}

export function ValidateJWT1(req: Request, res: Response, next: NextFunction): void {

    const token = req.header('x-token');

    if (!token) {
        throw {
            message: 'Missing Token',
        };
    }

    try {

        const { data } = jwt.verify(
            token,
            Config().JWT_SECRET_KEY
        ) as JwtPayload
                
        req.body = data;
        
    } catch (error) {
        throw {
            message: 'Token invalid',
        };
    }

    next();

    //   const _ = { err: err } as { err: string };

    //   res.status(400).json({ ...Boom.forbidden(_.err).output.payload });

}