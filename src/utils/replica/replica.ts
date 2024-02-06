import Boom from '@hapi/boom';
import { Response } from 'express';
import { Consts } from '../../utils';

interface IReplica {
	status?: 'success';
	message: keyof typeof Consts.ResponseMessages;
	data?: object | [];
	success?: boolean;
	statusCode?: number;
}

function Replica(res: Response, { status = 'success', data, message, success = true, statusCode }: IReplica): void {
	try {
		const SUCCESS = success || status === 'success';
		const STATUS_CODE = typeof statusCode === 'number' ? statusCode : SUCCESS ? 200 : 400;

		res.status(STATUS_CODE).json({
			statusCode: STATUS_CODE,
			success: SUCCESS,
			message: Consts.ResponseMessages[message][status],
			data: data ? data : {},
		});
	} catch (error) {
		console.error(error);

		res
			.status(Boom.internal().output.payload.statusCode)
			.json({ ...Boom.internal().output.payload, success: false, data: {} });
	}
}

export { Replica };
