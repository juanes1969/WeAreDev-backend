/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';

dotenv.config();

interface Config {
	APP_URL: string;

	JWT_SECRET_KEY: string;
	JWT_EXPIRES_IN: string;

	DB_LOGGING: boolean;
	DB_SYNC: boolean;
	DB_PORT: string;
	DB_HOST: string;
	DB_NAME: string;
	DB_USER: string;
	DB_PASS: string;

	NODE_ENV: 'development' | 'production';

	SV_PORT: string;
	SENDGRID_SECRET_APIKEY: string;
}

const configVars = [
	{ envVar: 'APP_URL', propName: 'APP_URL' },

	{ envVar: 'JWT_SECRET_KEY', propName: 'JWT_SECRET_KEY' },
	{ envVar: 'JWT_EXPIRES_IN', propName: 'JWT_EXPIRES_IN' },

	{ envVar: 'DB_LOGGING', propName: 'DB_LOGGING' },
	{ envVar: 'DB_SYNC', propName: 'DB_SYNC' },

	{ envVar: 'DB_PORT', propName: 'DB_PORT' },
	{ envVar: 'DB_HOST', propName: 'DB_HOST' },
	{ envVar: 'DB_NAME', propName: 'DB_NAME' },
	{ envVar: 'DB_USER', propName: 'DB_USER' },
	{ envVar: 'DB_PASS', propName: 'DB_PASS' },

	{ envVar: 'NODE_ENV', propName: 'NODE_ENV' },
	{ envVar: 'NODE_ENV', propName: 'NODE_ENV' },
	{ envVar: 'SENDGRID_SECRET_APIKEY', propName: 'SENDGRID_SECRET_APIKEY' },

];

export function Config(): Config {
	const config: Partial<Config> | any = {};

	configVars.map(({ envVar, propName }) => {
		const value = process.env[envVar];

		if (!value) {
			throw new Error(`${envVar} missing in environment variables`);
		}

		config[propName] = value === 'true' ? true : value === 'false' ? false : value;
	});

	return config as Config;
}

Config();
