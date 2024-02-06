import { NextFunction, Request, Response } from 'express';
import { Services } from '../../../services';
import { Replica } from '../../../utils';

async function ListClient(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, {
			message: 'ClientFound',
			data: await Services.Client.ListClient(),
		});
	} catch (error) {
		next(error);
	}
}

async function ListClientByName(req: Request, res: Response, next: NextFunction) {

	try {
		const DataRest = await Services.Client.ListClientByNameProyect(req.params.name);

		Replica(res, {
			message: 'ClientFound',
			data: DataRest,
		});
	} catch (error) {
		next(error);
	}
}


async function RegisterClient(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, {
			message: 'ClientFound',
			data: await Services.Client.CreateClient({ payload: req.body }),
		});
	} catch (error) {
		next(error);
	}
}


export default {
	ListClient,
	RegisterClient,
	ListClientByName	
};
