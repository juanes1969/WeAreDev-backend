/* eslint-disable no-mixed-spaces-and-tabs */
import { NextFunction, Request, Response } from 'express';
import { Services } from '../../../services';
import { Bcrypt, JWT, Replica } from '../../../utils';
import { Repos } from '../../../repos';

interface IReqLogin extends Request {
	body: {
		email: string;
		password: string;
		token?: string;
	};
}

async function Login(req: IReqLogin, res: Response, next: NextFunction) {
	try {
		const DATA = await Services.Auth.Login({ payload: { email: req.body.email } });

		if (!DATA) {
			throw {
				message: 'unauthorized',
				origin: 'login',
			};
		}

		if (!Bcrypt.comparePassword({ password: req.body.password, hash: DATA?.password as string })) {
			throw {
				message: 'unauthorized',
				origin: 'login',
			};
		}

		const USER = await Repos.getUser({
			payload: {
				id: DATA.id,
			},
		});

		Replica(res, {
			message: 'Login',
			data: {
				user: USER,
				token: JWT.Sign({ data: { user: USER } }),
			},
		});
	} catch (error) {
		next(error);
	}
}

async function renew(req: Request, res: Response, next: NextFunction) {

	try {
		const { user } = req.body;
		const token = JWT.Sign({ data: { user: user } });
			
		Replica(res, {
			message: 'Login',
			data: {
				ok: true,
				user,
				token
			},
		});

	} catch (error) {
		next(error);
	}
}

async function ForgotPassword(req: Request, res: Response, next: NextFunction) {
	try {
		return;
	} catch (error) {
		next(error);
	}
}

async function VerifyPassword(req: Request, res: Response, next: NextFunction) {
	try {
		return;
	} catch (error) {
		next(error);
	}
}

async function ResetPassword(req: Request, res: Response, next: NextFunction) {
	try {
		return;
	} catch (error) {
		next(error);
	}
}

export default {
	Login,
	renew,
	ForgotPassword,
	VerifyPassword,
	ResetPassword,
};
