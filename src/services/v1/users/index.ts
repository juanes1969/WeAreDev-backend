import { EUserStatus } from '../../../global';
import { Models, sequelize } from '../../../libs';
import { Repos } from '../../../repos';
import { Bcrypt, Config } from '../../../utils';
import SendGridMsl from '@sendgrid/mail';

async function ListPost() {

	const USERS = await Models.Users().findAll({
		include: {
			model: Models.Roles(),
			as: 'roles',
			attributes: [],
			through: { attributes: [] },
			required: true,
			duplicating: false,
			where: {
				"role": "leader",
			},
		},
		attributes: {
			include: [[sequelize.fn('array_agg', sequelize.col('roles.role')), 'rolesArray']],
			exclude: ['password'],
		},
		where: {
			liderId: "0"
		},
		group: ['users.id', 'roles.id'],
		order: [['createdAt', 'DESC']]
	});

	return { rows: USERS };
}

async function ListAllUsers() {

	const USERS = await Models.Users().findAll({
		include: {
			model: Models.Roles(),
			as: 'roles',
			attributes: [],
			through: { attributes: [] },
			required: true,
			duplicating: false,
			where: {
				"role": "collaborator",
			},
		},
		attributes: {
			include: [[sequelize.fn('array_agg', sequelize.col('roles.role')), 'rolesArray']],
			exclude: ['password'],
		},
		group: ['users.id', 'roles.id'],
		order: [['createdAt', 'DESC']]
	});

	return { rows: USERS };
}

async function ListGetByLeader(leaderId: number) {

	const EMPLOYE = (await Models.Users().findOne({
		where: {
			liderId: leaderId,
		},
	}));

	if (!EMPLOYE) {
		throw {
			message: 'EmployesNotFound',
		};
	}

	const EMPLOYE_WITH_LEADER = (await Models.Users().findAll({
		include: {
			model: Models.TimeRegister(),
			as: 'time_registers',
			duplicating: false,
			// where: {
			// 	stateId: 1
			// },
			attributes: {
				include: [
					[sequelize.literal('(SELECT "description" FROM client WHERE id = time_registers."clientId")'), 'clientId'],
					[sequelize.literal('(SELECT "description" FROM proyect WHERE id = time_registers."proyectId")'), 'proyectId'],
				],
				exclude: ['clientId', 'proyectId'],
			},
		},

		attributes: {
			exclude: ['password'],

		},
		where: {
			liderId: leaderId
		}
	}));

	return EMPLOYE_WITH_LEADER
}


async function ListAllPost() {
	const USERS_COUNT = await Models.Users().count();

	if (USERS_COUNT === 0) {
		throw {
			message: 'usersNotFound',
		};
	}

	const USERS = await Models.Users().findAll({
		include: {
			model: Models.Roles(),
			as: 'roles',
			attributes: [],
			through: { attributes: [] },
			required: true,
			duplicating: false
		},
		attributes: {
			include: [[sequelize.fn('array_agg', sequelize.col('roles.role')), 'rolesArray']],
			exclude: ['password'],
		},
		group: ['users.id', 'roles.id'],
		order: [['createdAt', 'DESC']],
	});

	return { count: USERS_COUNT, rows: USERS };
}

async function Post({
	payload,
}: {
	payload: {
		firstName: string;
		secondName: string;
		firstLastName: string;
		secondLastName: string;
		cellPhone: string;
		email: string;
		role: string;
		typeId: string;
		personalId: string;
		password: string;
		photoURL: string;
		charge: string;
		liderId: number;
	};
}) {

	SendGridMsl.setApiKey(Config().SENDGRID_SECRET_APIKEY);

	const RETRIEVE_USER = !!(await Models.Users().findOne({
		where: {
			email: payload.email,
		},
	}));

	console.log(payload);

	if (RETRIEVE_USER) {
		throw {
			message: 'userAlreadyExists',
		};
	}

	const POST_USER = await Models.Users().create({
		firstName: payload.firstName,
		secondName: payload.secondName,
		firstLastName: payload.firstLastName,
		secondLastName: payload.secondLastName,
		email: payload.email,
		status: EUserStatus.Created,
		typeId: payload.typeId,
		personalId: payload.personalId,
		password: Bcrypt.hashPassword({ password: payload.password as string }),
		photoURL: payload.photoURL,
		charge: payload.charge,
		liderId: payload.liderId
	});

	//arreglar el tema de sendgrid

	// const messageMail = {
	// 	to: payload.email,
	// 	from: payload.email,
	// 	subject: '¡Registro exitoso!',
	// 	text: 'Tu clave y tu contraseña son....',
	// };

	// await SendGridMsl.send(messageMail);

	const POST_ROLE = await Models.Roles().findOne({
		where: {
			role: payload.role,
		},
	});

	await POST_USER.addRoles(POST_ROLE);

	if (!POST_USER.id) throw 'Error';

	const GET_USER = await Repos.getUser({ payload: { id: POST_USER.id } });

	if (!GET_USER) {
		throw {
			message: 'userNotFound',
		};
	}

	const password = Config().NODE_ENV === 'development' ? payload.password : undefined;

	return { ...GET_USER?.toJSON(), password };
}

async function Patch({
	payload,
}: {
	payload: {
		id: number;
		firstName: string;
		secondName: string;
		firstLastName: string;
		secondLastName: string;
		cellPhone: string;
		email: string;
		password: string;
	};
}) {
	const USER_RETRIEVE = !!(await Models.Users().findByPk(payload.id));

	if (!USER_RETRIEVE) {
		throw {
			message: 'userNotFound',
		};
	}

	const USER_UPDATE = await Models.Users().update(
		{
			firstName: payload.firstName,
			secondName: payload.secondName,
			firstLastName: payload.firstLastName,
			secondLastName: payload.secondLastName,
			email: payload.email,
			password: Bcrypt.hashPassword({ password: payload.password }),
		},
		{
			where: {
				id: payload.id,
			},
		}
	);

	if (!USER_UPDATE) {
		throw {
			message: 'userNotModified',
		};
	}

	return { id: payload.id };
}

export default {
	ListPost,
	ListAllUsers,
	ListAllPost,
	ListGetByLeader,
	Post,
	Patch,
};
