import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { Config, JWT } from '../../utils';
import { EUserRole } from '../../global';
import { ROUTES } from './routes';
import { Repos } from '../../repos';

type TRoles = [EUserRole.Admin | EUserRole.Leader | EUserRole.Collaborator];

interface ValidatorOptions {
	schema: object | Joi.Schema;
	origin?: 'body' | 'query' | 'params';
	roles?: TRoles;
}

export function Validator({ schema, origin = 'body' }: ValidatorOptions) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const headerAuth = req.headers.authorization;
			const tokenString = headerAuth?.startsWith('Bearer ') ? headerAuth?.split(' ')[1] : headerAuth?.trim();
			const schemaObject = Joi.isSchema(schema) ? schema : Joi.object(schema);
			const requestPath = `${req.method}-${req.baseUrl}${req.path}`;
			const routeObject = Object.values(ROUTES).find((payload) => payload.url === requestPath);
			const routePublicParams = { roles: ['public'] };
			const hasRequiredJWT = !routeObject?.roles.some((role) => routePublicParams.roles.includes(role));
			let jwtDecoded;
			let userRoles: string[] = [];

			/**
			 * Verify the token if the route is not public
			 */

			if (hasRequiredJWT && !JWT.Verify({ token: tokenString })) {
				next(Boom.unauthorized().output.payload);

				return;
			} else {
				jwtDecoded = JWT.Decode(tokenString);

				/**
				 * Decode the code and then check the type for object and get the id from the decoded JWT
				 */

				if (typeof jwtDecoded === 'object' && jwtDecoded?.data?.user?.id) {
					userRoles = await Repos.getUser({ payload: { id: jwtDecoded?.data?.user?.id }, showPassword: false }).then(
						(user) => {
							if (!user) {
								throw {
									message: 'userNotFound',
								};
							}

							return user?.dataValues?.rolesArray || [];
						}
					);
				}
			}

			if (routeObject) {
				const HasRequiredRole = userRoles.some((role) => routeObject.roles.includes(role));

				if (HasRequiredRole) {
					if (Config().NODE_ENV !== 'production') {
						console.warn(`User has the required role '${routeObject.roles[0]}' for ${requestPath}`);
					}
				} else if (!hasRequiredJWT) {
					if (Config().NODE_ENV !== 'production') {
						console.warn(`User does not have the required role '${routeObject.roles[0]}' for ${requestPath}`);
					}

					next(
						Boom.unauthorized(`User does not have the required role '${routeObject.roles[0]}' for ${requestPath}`)
							.output.payload
					);

					return;
				}
			} else {
				if (Config().NODE_ENV !== 'production') {
					console.error(`Invalid route: ${requestPath}`);
				}

				throw {
					message: 'invalidRoute',
				};
			}

			const CheckSchema = schemaObject.validate(req[origin]).error;

			if (CheckSchema) {
				return next(Boom.badRequest(CheckSchema.toString().replace('ValidationError: ', '')).output.payload);
			}

			if (schemaObject && req[origin] && origin == 'body') {
				req.body = schemaObject.validate(req[origin]).value;
			}

			next();
		} catch (err) {
			next(err);
		}
	};
}
