import { NextFunction, Request, Response } from 'express';
import { Services } from '../../../services';
import { JWT, Replica } from '../../../utils';
import { Repos } from '../../../repos';

async function ListPost(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, {
			message: 'UsersFound',
			data: await Services.Users.ListPost(),
		});
	} catch (error) {
		next(error);
	}
}

async function ListAllUser(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, {
			message: 'UsersFound',
			data: await Services.Users.ListAllUsers(),
		});
	} catch (error) {
		next(error);
	}
}

async function GetByLeader(req: Request, res: Response, next: NextFunction) {
	
	try {
		const DataRest = await Services.Users.ListGetByLeader(parseInt(req.params.leaderId));

		Replica(res, {
			message: 'UsersFound',
			data: {
				user: DataRest, 				
			},
		});

	} catch (error) {
		next(error);
	}
}

async function ListAllPost(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, {
			message: 'UsersFound',
			data: await Services.Users.ListAllPost(),
		});
	} catch (error) {
		next(error);
	}
}

async function Post(req: Request, res: Response, next: NextFunction) {
	try {
		const DATA = await Services.Users.Post({ payload: req.body });

		const USER = await Repos.getUser({
			payload: {
				id: DATA.id,
			},
		});


		Replica(res, {
			message: 'UserCreated',
			data: {
				user: DATA,
				token: JWT.Sign({ data: { user: USER } })
			}
		});
	} catch (error) {
		next(error);
	}
}

async function Patch(req: Request, res: Response, next: NextFunction) {
	try {
		const DataRest = await Services.Users.Patch({ payload: req.body });

		Replica(res, {
			message: 'UserModified',
			data: DataRest,
		});
	} catch (error) {
		next(error);
	}
}

export default {
	ListPost,
	ListAllUser,
	ListAllPost,
	GetByLeader,
	Post,
	Patch,
};
