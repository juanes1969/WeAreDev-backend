/* eslint-disable @typescript-eslint/no-explicit-any */
import { Includeable, Order } from 'sequelize';
import { Models, sequelize } from '../../libs';

interface IGetUserPayload {
	id?: number;
	email?: string;
}

async function getUser({ payload, showPassword = false }: { payload: IGetUserPayload; showPassword?: boolean }) {
	const ID = payload.id ? { id: payload.id } : undefined;
	const EMAIL = payload.email ? { email: payload.email } : undefined;
	const SHOW_PASSWORD = showPassword ? [] : ['password'];
	
	return await Models.Users().findOne({
		where: {
			...ID,
			...EMAIL,
		},
		include: {
			model: Models.Roles(),
			as: 'roles',	
			attributes: [],
			through: { attributes: [] },
		},
		attributes: {
			include: [[sequelize.fn('array_agg', sequelize.col('roles.role')), 'rolesArray']],
			exclude: SHOW_PASSWORD,
		},
		group: ['users.id', 'roles.id'],
	});
}

interface IFindAll {
	model: keyof typeof Models;
	page: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
	filterBy?: Record<string, any>;
	excludeBy?: Array<string>;
	total?: boolean;
	include?: object;
	attributes?: object;
}

async function findAll({
	model,
	page = 1,
	limit,
	sortBy,
	sortOrder,
	filterBy,
	excludeBy,
	total,
	include,
	attributes,
}: IFindAll) {
	const OFFSET = (page - 1) * (limit || 10);
	const WHERE_CLAUSE = filterBy ? { where: filterBy } : {};
	const ORDEN_CLAUSE: Order = sortBy ? [[sortBy, sortOrder || 'ASC']] : [['createdAt', 'DESC']];
	const EXCLUDE_CLAUSE = excludeBy && excludeBy.length > 0 ? { exclude: excludeBy } : [];
	const ATTRIBUTES_CLAUSE = attributes ? { ...attributes } : {};
	const INCLUDE_CLAUSE = include ? (Array.isArray(include) ? include : { ...include }) : {};
	const MODEL: any = Models[model]();
	const OBJECT = {
		offset: OFFSET,
		limit: limit === 0 ? undefined : limit || 10,
		...WHERE_CLAUSE,
		attributes: {
			...EXCLUDE_CLAUSE,
			...ATTRIBUTES_CLAUSE,
		},
		include: INCLUDE_CLAUSE,
		// group: ['users.id', 'roles.id'],
		order: ORDEN_CLAUSE,
	};

	if (total) {
		return await MODEL.findAndCountAll(OBJECT);
	}

	return MODEL.findAll(OBJECT);
}

async function findOneByPk({
	model,
	id,
	include = undefined,
}: {
	model: keyof typeof Models;
	id: number;
	include?: Includeable | Includeable[] | undefined;
}) {
	const MODEL: any = Models[model]();

	return await MODEL.findByPk(id, {
		include: include,
	});
}

export default {
	findAll,
	getUser,
	findOneByPk,
};
