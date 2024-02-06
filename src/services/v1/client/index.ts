import { Op, Sequelize } from 'sequelize';
import { Models, sequelize } from '../../../libs';

async function ListClient() {
	const CLIENT_COUNT = await Models.Client().count();

	if (CLIENT_COUNT === 0) {
		throw {
			message: 'clientNotFound',
		};
	}

	const CLIENTS = await Models.Client().findAll({
		order: [['createdAt', 'DESC']],
	});

	return { count: CLIENT_COUNT, rows: CLIENTS };
}

async function ListClientByNameProyect(name: string) {

	const RETRIEVE_CLIENT = await Models.Client().findOne({
		where: {
			description: {
				[Op.iLike]: `%${name}%`
			}
		},
	});

	if (typeof RETRIEVE_CLIENT === 'boolean') {
		// La consulta devolvió un valor booleano (true o false), lo manejamos en consecuencia
		if (RETRIEVE_CLIENT) {
			// No hay error, pero no se encontró ningún cliente
			return {
				clientId: 0
			};
		} else {
			// Podrías lanzar una excepción u otro manejo de error según tus necesidades
			throw {
				message: 'Error in finding client'
			};
		}
	}

	// Si RETRIEVE_CLIENT no es booleano, entonces es un objeto Client
	if (!RETRIEVE_CLIENT) {
		// No se encontró ningún cliente
		return {
			clientId: 0
		};
	}

	// Se encontró un cliente, retornamos su ID
	return {
		clientId: RETRIEVE_CLIENT.id
	};
	// return { clientId: RETRIEVE_CLIENT }
}

async function CreateClient({
	payload,
}: {
	payload: {
		description: string
	};
}) {
	const RETRIEVE_CLIENT = !!(await Models.Client().findOne({
		where: {
			description: payload.description
		},
	}));

	if (RETRIEVE_CLIENT) {
		throw {
			message: 'Client already exist'
		};
	}

	const POST_CLIENT = await Models.Client().create({
		description: payload.description
	});

	if (!POST_CLIENT) {
		throw {
			message: 'Client not created',
		};
	}

	return POST_CLIENT;
}



export default {
	ListClient,
	CreateClient,
	ListClientByNameProyect	
};
