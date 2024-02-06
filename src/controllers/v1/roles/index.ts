import { NextFunction, Request, Response } from 'express';
import { Services } from '../../../services';
import { Replica } from '../../../utils';

async function ListRoles(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, {
			message: 'RolesFound',
			data: await Services.Roles.ListRoles(),
		});
	} catch (error) {
		next(error);
	}
}

export default {
	ListRoles
};
