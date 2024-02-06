import { ROLES } from 'libs/seeds/data/roles';
import { Models, sequelize } from '../../../libs';
import { Repos } from '../../../repos';
import { Bcrypt, Config } from '../../../utils';
import { Console, log } from 'console';
import { where } from 'sequelize';
const { Op } = require('sequelize');


async function ListRoles() {

	const ROLES_COUNT = await Models.Roles().count();

	if (ROLES_COUNT === 0) {
		throw {
			message: 'rolesNotFound',
		};
	}

	const ROLES = await Models.Roles().findAll({
		order: [['createdAt', 'DESC']],
		where: {
			role: {
				[Op.not]: 'admin'
			}
		}
	})


	return { count: ROLES_COUNT, rows: ROLES };
}

export default {
	ListRoles
};
