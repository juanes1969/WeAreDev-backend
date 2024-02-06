import Boom from '@hapi/boom';
import type { Request, Response, NextFunction } from 'express';
import { Config } from '../../utils';
import Chalk from 'chalk';

interface ErrorItem {
	statusCode?: number;
	status?: number;
	origin?: string;
	error?: string;
}

interface ErrorModified extends Error, ErrorItem {}

export const errorMap: Record<
	string,
	{
		statusCode: number;
		message: string;
		data?: unknown;
	}
> = {
	usersNotFound: {
		...Boom.notFound('Users not found').output.payload,
		data: {
			count: 0,
			rows: [],
		},
	},

	vacanciesListNotFound: {
		...Boom.notFound('Vacancies not found').output.payload,
		data: [],
	},
	vacancyNotCreated: {
		...Boom.notFound('Vacancy not created').output.payload,
		data: {},
	},
	vacancyNotFound: {
		...Boom.notFound('Vacancy not found').output.payload,
		data: {},
	},
	vacancyNotSaved: {
		...Boom.notFound('Vacancy not saved').output.payload,
		data: {},
	},

	announcementsListNotFound: {
		...Boom.notFound('Announcements not found').output.payload,
		data: [],
	},
	announcementNotCreated: {
		...Boom.notFound('Announcement not created').output.payload,
		data: {},
	},
	announcementNotFound: {
		...Boom.notFound('Announcement not found').output.payload,
		data: {},
	},
	announcementNotSaved: {
		...Boom.notFound('Announcement not saved').output.payload,
		data: {},
	},

	requestPendingNotFound: {
		...Boom.notFound('Not request pending').output.payload,
		data: {
			totalPending: 0,
		},
	},

	codeNotFound: { ...Boom.notFound('Code not found').output.payload, data: {} },
	userNotFound: { ...Boom.notFound('User not found').output.payload, data: {} },
	userNotCreated: { ...Boom.notFound('User not created').output.payload, data: {} },

	companyCreated: { ...Boom.notFound('Company registered').output.payload, data: {} },
	companyNotCreated: { ...Boom.notFound('Company not registered').output.payload, data: {} },

	emptyList: {
		...Boom.notFound('Empty list').output.payload,
		data: {
			data: [],
			total: 0,
		},
	},

	unauthorized: Boom.forbidden('Access to the requested resource has been denied').output.payload,
	notFoundArray: {
		...Boom.notFound('Not found').output.payload,
		data: [],
	},
	notFound: {
		...Boom.notFound('Not found').output.payload,
		data: {},
	},
	badRequest: Boom.badRequest().output.payload,
};

export function ErrorHandler(err: ErrorModified, req: Request, res: Response, next: NextFunction) {
	const Error = Boom.internal().output.payload;

	const DevError = {
		statusCode: err.statusCode ?? 500,
		error: err.stack ?? '',
		message: err.message.replace(/"/g, '').slice(0, 1).toUpperCase().concat(err.message.replace(/"/g, '').slice(1)),
	};

	if (Config().NODE_ENV === 'development') {
		console.error(
			`\n${Chalk.red(
				JSON.stringify(
					{
						error: err.stack,
						message: err.message,
					},
					null,
					2
				)
			)}`
		);
	}

	const errorPayload = Object.keys(errorMap).find((payload) => err.message === payload);

	if (errorPayload) {
		const ErrorCustom = errorMap[err.message];

		return res.status(ErrorCustom.statusCode).json(ErrorCustom);
	}

	if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
		console.error(`\n${Chalk.red(err.message)}`);

		return res.status(errorMap.badRequest.statusCode).json(errorMap.badRequest);
	}

	console.error(err);

	res.status(Error.statusCode).json(DevError);
}

export function NotFound(req: Request, res: Response) {
	const Error = Boom.notFound().output.payload;

	res.status(Error.statusCode).json(Error);
}