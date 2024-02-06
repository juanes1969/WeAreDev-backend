import { Request, Router } from 'express';
import { Config } from '../../utils';

import RouteAuth from './auth';
import RouteUsers from './users';
import RouteTimes from './RegisterTimes';
import RouteRoles from './roles';
import RouteClient from './client';
import RouteProject from './project';
import RouteKudos from './kudos';

const router = Router();

export interface IReqGetAll extends Request {
	body: {
		page: number;
		limit: number;
	};
}

router.use('/auth', RouteAuth)
	.use('/user', RouteUsers)
	.use('/time', RouteTimes)
	.use('/roles', RouteRoles)
	.use('/client', RouteClient)
	.use('/project', RouteProject)
	.use('/kudo', RouteKudos);

if (Config().NODE_ENV === 'development') {
	// router.use('/dev', RouteDev);
}

export const routesV1 = router;
