import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';

export function ValidateJWT(req: Request, res: Response, next: NextFunction): void {
  try {
    JWT.verify(req.body.jwt.replace('Bearer ', ''), '12345', (err: unknown) => {
      if (err) throw err;
    });

    next();
  } catch (err) {
    const _ = { err: err } as { err: string };

    res.status(400).json({ ...Boom.forbidden(_.err).output.payload });
  }
}
