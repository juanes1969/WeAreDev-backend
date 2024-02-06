import { NextFunction, Request, Response } from 'express';
import { Services } from '../../../services';
import { Replica } from '../../../utils';

async function sendKudoMail(req: Request, res: Response, next: NextFunction) {

	const dataRest = await Services.Kudos.sendMail({ payload: req.body });

	try {
		Replica(res, {
			message: 'RolesFound',
			data: dataRest
		});
	} catch (error) {
		next(error);
	}
}

async function getByEmail(req: Request, res: Response, next: NextFunction) {

	try {
        const DataRest = await Services.Kudos.getKudosByEmail(req.params.email);

        Replica(res, {
            message: 'RegisterTimeList',
            data: DataRest,
        });

    } catch (error) {
        next(error);
    }
}

export default {
	sendKudoMail,
	getByEmail
};
