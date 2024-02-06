
import { Models, sequelize } from '../../../libs';

async function ListProject() {
	const result = await Models.Proyect().findAll({
		attributes: [
			[sequelize.literal('"proyect"."id"'), 'proyectId'],
			[sequelize.literal('"proyect"."description"'), 'projectName'],
			[sequelize.literal('(SELECT "id" FROM client WHERE id = "clientId")'), 'clientId'],
			[sequelize.literal('(SELECT "description" FROM client WHERE id = "clientId")'), 'clientName'],
			[sequelize.literal('"proyect"."isActive"'), 'isActive'],
			[sequelize.literal('"proyect"."createdAt"'), 'createdAt'],
			[sequelize.literal('"proyect"."updatedAt"'), 'updatedAt'],
		],
		include: [{
			model: Models.Client(),
			attributes: [],
			as: 'client',
		}],
		where: {
			isActive: true
		},
		raw: true
	});

	return result
}

async function ListProjectAndClientByUserId(userId: number) {

	const result = await Models.ProyectUser().findAll({
		attributes: [
			[sequelize.literal('"proyect_user"."id"'), 'id'],
			[sequelize.literal('"user"."personalId"'), 'personalId'],
			[sequelize.literal('"user"."firstName"'), 'firstName'],
			[sequelize.literal('"user"."secondName"'), 'secondName'],
			[sequelize.literal('"user"."firstLastName"'), 'firstLastName'],
			[sequelize.literal('"proyect"."id"'), 'proyectId'],
			[sequelize.literal('"proyect"."description"'), 'projectName'],
			[sequelize.literal('"proyect"."clientId"'), 'clientId'],
			[sequelize.literal('(SELECT "description" FROM client WHERE id = "clientId")'), 'clientName'],
			[sequelize.literal('"proyect_user"."isActive"'), 'isActive'],
			[sequelize.literal('"proyect_user"."createdAt"'), 'createdAt'],
			[sequelize.literal('"proyect_user"."updatedAt"'), 'updatedAt'],
		],
		include: [{
			model: Models.Proyect(),
			attributes: [],
		}, {
			model: Models.Users(),
			attributes: []
		}],
		where: {
			userId: userId,
		}
	});

	return result
}

async function ListAllProjectAndClientAssigned() {

	const result = await Models.ProyectUser().findAll({
		attributes: [
			[sequelize.literal('"proyect_user"."id"'), 'id'],
			[sequelize.literal('"user"."id"'), 'userId'],
			[sequelize.literal('"user"."personalId"'), 'personalId'],
			[sequelize.literal('"user"."firstName"'), 'firstName'],
			[sequelize.literal('"user"."secondName"'), 'secondName'],
			[sequelize.literal('"user"."firstLastName"'), 'firstLastName'],
			[sequelize.literal('"proyect"."id"'), 'proyectId'],
			[sequelize.literal('"proyect"."description"'), 'projectName'],
			[sequelize.literal('"proyect"."clientId"'), 'clientId'],
			[sequelize.literal('(SELECT "description" FROM client WHERE id = "clientId")'), 'clientName'],
			[sequelize.literal('"proyect_user"."isActive"'), 'isActive'],
			[sequelize.literal('"proyect_user"."createdAt"'), 'createdAt'],
			[sequelize.literal('"proyect_user"."updatedAt"'), 'updatedAt'],
		],
		include: [{
			model: Models.Proyect(),
			attributes: [],
		}, {
			model: Models.Users(),
			attributes: []
		}]
	});

	return result
}

async function CreateProject({
	payload,
}: {
	payload: {
		description: string,
		clientId: number[],
		isActive: boolean,
	};
}) {

	const RETRIEVE_PROJECT = !!(await Models.Proyect().findOne({
		where: {
			description: payload.description
		},
	}));

	if (RETRIEVE_PROJECT) {
		throw {
			message: 'Project already exist'
		};
	}

	const POST_PROJECT = await Promise.all(
		payload.clientId.map((clientId) =>
			Models.Proyect().create({
				description: payload.description,
				clientId,
				isActive: payload.isActive,
			})
		)
	);

	if (!POST_PROJECT) {
		throw {
			message: 'Project not created',
		};
	}


	return POST_PROJECT;
}

async function AssingProject({
	payload,
}: {
	payload: {
		userId: number,
		proyectId: number[]
	};
}) {

	const RETRIEVE_PROJECT = !!(await Models.ProyectUser().findOne({
		where: {
			userId: payload.userId,
			proyectId: payload.proyectId
		},
	}));

	if (RETRIEVE_PROJECT) {
		throw {
			message: 'Assing project already exist.'
		};
	}

	const POST_PROJECT = await Promise.all(
		payload.proyectId.map((proyectId) =>
			Models.ProyectUser().create({
				userId: payload.userId,
				proyectId: proyectId,
				isActive: true
			})
		)
	);

	if (!POST_PROJECT) {
		throw {
			message: 'Assing project not created.',
		};
	}

	return POST_PROJECT;
}

async function ChangeStateDesactive(projectId: number) {

	const STATE_DELETE = !!(await Models.Proyect().findOne({
		where: {
			id: projectId
		}
	}));

	if (!STATE_DELETE) {
		throw {
			message: 'Project notFound',
		};
	}

	const STATE_DELETE_PROJECT = await Models.Proyect().update(
		{ isActive: false },
		{
			where: {
				id: projectId
			}
		}
	);

	if (!STATE_DELETE_PROJECT) {
		throw {
			message: 'projectNotChangeStatus',
		};
	}

	return { projectId: projectId };
}

async function ChangeStateDesactiveAssignement(projectId: number) {

	const STATE_DELETE = !!(await Models.ProyectUser().findOne({
		where: {
			id: projectId
		}
	}));

	if (!STATE_DELETE) {
		throw {
			message: 'Project notFound',
		};
	}

	const STATE_DELETE_PROJECT = await Models.ProyectUser().update(
		{ isActive: false },
		{
			where: {
				id: projectId
			}
		}
	);

	if (!STATE_DELETE_PROJECT) {
		throw {
			message: 'projectNotChangeStatus',
		};
	}

	return { projectId: projectId };
}

async function updateProject({
	payload,
}: {
	payload: {
		id: number;
		description: string;
		clientId: number;
		isActive: boolean;
	};
}) {
	const PROJECT_RETRIVE = !!(await Models.Proyect().findByPk(payload.id));

	if (!PROJECT_RETRIVE) {
		throw {
			message: 'proyectN',
		};
	}

	const PROJECT = await Models.Proyect().update(
		{
			description: payload.description,
			clientId: payload.clientId,
			isActive: payload.isActive
		},
		{
			where: {
				id: payload.id,
			},
		}
	);

	if (!PROJECT) {
		throw {
			message: 'proyectNotModified',
		};
	}

	return { id: payload.id };
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
