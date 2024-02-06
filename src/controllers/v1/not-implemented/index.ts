import { NextFunction, Request, Response } from 'express';
import { Replica } from '../../../utils';

export default function ControllerNotImplemented(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, { message: 'NotController' });
	} catch (error) {
		next(error);
	}
}
