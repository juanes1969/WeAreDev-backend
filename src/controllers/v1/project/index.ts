import { NextFunction, Request, Response } from 'express';
import { Services } from '../../../services';
import { Replica } from '../../../utils';

async function ListProject(req: Request, res: Response, next: NextFunction) {
	try {
		Replica(res, {
			message: 'ProjectFound',
			data: await Services.Project.ListProject(),
		});
	} catch (error) {
		next(error);
	}
}

async function ListAllProjectAndClientAssigned(req: Request, res: Response, next: NextFunction) {



	try {
		Replica(res, {
			message: 'ProjectFound',
			data: await Services.Project.ListAllProjectAndClientAssigned()

		});
	} catch (error) {
		next(error);
	}
}

async function ListProjectAndClientByUserId(req: Request, res: Response, next: NextFunction) {



	try {
		Replica(res, {
			message: 'ProjectFound',
			data: await Services.Project.ListProjectAndClientByUserId(parseInt(req.params.userId))

		});
	} catch (error) {
		next(error);
	}
}


async function CreateProject(req: Request, res: Response, next: NextFunction) {

	try {
		Replica(res, {
			message: 'ProjectFound',
			data: await Services.Project.CreateProject({ payload: req.body })
		});
	} catch (error) {
		next(error);
	}
}

async function AssingProject(req: Request, res: Response, next: NextFunction) {

	try {
		Replica(res, {
			message: 'ProjectFound',
			data: await Services.Project.AssingProject({ payload: req.body })
		});
	} catch (error) {
		next(error);
	}
}

async function ChangeStateDesactive(req: Request, res: Response, next: NextFunction) {

	try {
		Replica(res, {
			message: 'ProjectFound',
			data: await Services.Project.ChangeStateDesactive(parseInt(req.params.projectId))
		});
	} catch (error) {
		next(error);
	}
}

async function ChangeStateDesactiveAssignement(req: Request, res: Response, next: NextFunction) {

	try {
		Replica(res, {
			message: 'ProjectFound',
			data: await Services.Project.ChangeStateDesactiveAssignement(parseInt(req.params.projectId))
		});
	} catch (error) {
		next(error);
	}
}

async function updateProject(req: Request, res: Response, next: NextFunction) {
	try {
		const DataRest = await Services.Project.updateProject({ payload: req.body });

		Replica(res, {
			message: 'ProjectFound',
			data: DataRest,
		});
	} catch (error) {
		next(error);
	}
}


export default {
	ListProject,
	ListProjectAndClientByUserId,
	ListAllProjectAndClientAssigned,
	CreateProject,
	AssingProject,
	ChangeStateDesactive,
	ChangeStateDesactiveAssignement,
	updateProject
};