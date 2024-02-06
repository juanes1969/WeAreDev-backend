import Chalk from 'chalk';
import { Sequelize } from 'sequelize';
import { Config } from '../utils';
import { setDBAssociations } from './associations';
import { Models as Base } from './models';
import CreateDBSeeds from './seeds';

export const sequelize: Sequelize = new Sequelize(Config().DB_NAME, Config().DB_USER, Config().DB_PASS, {
	host: Config().DB_HOST,
	dialect: 'postgres',
	// dialectOptions: {
	// 	ssl: {
	// 		require: true,
	// 		rejectUnauthorized: false,
	// 	},
	// },
	logging: (string) => {
		if (Config().DB_LOGGING) console.warn(`\n\x1b[35m=> ${string}`);
	},
	sync: {
		force: Config().DB_SYNC,
	},
});

sequelize // Verifica la conexión
	.authenticate()
	.catch((error: Error) => console.error(Chalk.red(`DB: No se pudo conectar a la base de datos ${error}`)));

export const Models = {
	Users: Base.MUsers(sequelize),
	Roles: Base.MRoles(sequelize),
	TimeRegister: Base.MTimeRegister(sequelize),
	Client: Base.MClient(sequelize),
	State: Base.MState(sequelize),
	Proyect: Base.MProyect(sequelize),
	ProyectUser: Base.MProyectUser(sequelize),
	KudosRegister: Base.MKudosRegister(sequelize),
	Templates: Base.MTemplate(sequelize)
};

sequelize.sync({ alter: Config().DB_SYNC }).then(async () => {
	if (Config().DB_SYNC) {
		CreateDBSeeds()
	}

	console.warn(
		Config().NODE_ENV === 'production' ? `${Chalk.yellow('\nSynchronized')}` : `└ ${Chalk.yellow('Synchronized')}`
	);
});

setDBAssociations();
