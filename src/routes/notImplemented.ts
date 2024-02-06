import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

function notImplemented(req: Request, res: Response, next: NextFunction) {
	try {
		res.status(200).json({
			statusCode: 200,
			message: 'Route not implemented',
			body: {},
		});
	} catch (error) {
		next(error);
	}
}

router
	.post('/', notImplemented)
	.delete('/', notImplemented)
	.patch('/', notImplemented)
	.get('/', notImplemented)
	.put('/', notImplemented);

export const NotImplemented = router;
