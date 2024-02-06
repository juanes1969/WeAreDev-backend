import { Request } from 'express';

import Auth from './auth';
import Users from './users';
import HealthCheck from './health-check';
import NotImplemented from './not-implemented';
import RegisterTimes from './RegisterTimes';
import Roles from './roles';
import Client from './client';
import Project from './project';
import Kudos from './kudos';


export interface IGetAll extends Request {
	body: {
		page: number;
		limit: number;
	};
}

export default {
	Auth,
	HealthCheck,
	Users,
	NotImplemented,
	RegisterTimes,
	Roles,
	Client,
	Project,
	Kudos
};
