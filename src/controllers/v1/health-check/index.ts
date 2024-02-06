import { Request, Response } from 'express';

async function Get(_: Request, res: Response) {
	res.json({
		ok: true,
		app: 'base',
	});
}

export default {
	Get,
};
