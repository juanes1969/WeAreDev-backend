import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { EUserRole } from '../../global';
import { Repos } from '../../repos';
import { Config, JWT } from '../../utils';
import { ROUTES } from './routes';

interface ValidatorOptions {
	schema: Joi.Schema;
	origin?: 'body' | 'query' | 'params';
	roles?: EUserRole.Admin | EUserRole.Leader | EUserRole.Collaborator;
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
				//return next(Boom.unauthorized().output.payload);
			} else {
				/**
				 * Decode the { tokenString } and then check the type for object and get the id from the decoded JWT
				 */

				jwtDecoded = JWT.Decode(tokenString);

				if (typeof jwtDecoded === 'object' && jwtDecoded?.data?.user?.id) {
					userRoles = await Repos.getUser({ payload: { id: jwtDecoded?.data?.user?.id }, showPassword: false }).then(
						(user) => {
							if (!user) {
								throw {
									message: 'userNotFound',
								};
							}

							/**
							 * If user { rolesArray } doesn't have items it will return an empty array
							 */

							return user?.dataValues?.rolesArray || [];
						}
					);
				}
			}

			/**
			 * If { routeObject } exists is valid it will verify the required roles
			 */

			if (routeObject) {
				const HasRequiredRole = userRoles.some((role) => routeObject.roles.includes(role));

				/**
				 * Ownership
				 */

				if (HasRequiredRole) {
					/**
					 * If the role includes { searcher or employer } it will verify the owner
					 */

					// if (routeObject?.roles.includes('searcher' || 'employer')) {
					// Models.CVs.Request
					// const isOwner = Models[model].findByPk(id, {
					// where: {
					// ownerId: req.ownerId
					// }
					// })
					// }

					if (Config().NODE_ENV !== 'production') {
						console.warn(`User has the required role '${routeObject.roles[0]}' for ${requestPath}`);
					}
				} else if (hasRequiredJWT) {
					if (Config().NODE_ENV !== 'production') {
						console.error(`User does not have the required role '${routeObject.roles[0]}' for ${requestPath}`);
					}

					// return next(
					// 	Config().NODE_ENV !== 'production'
					// 		? Boom.unauthorized().output.payload
					// 		: Boom.unauthorized(`User does not have the required role '${routeObject.roles[0]}' for ${requestPath}`)
					// 				.output.payload
					// );
				}
			} else {
				if (Config().NODE_ENV !== 'production') {
					console.error(`Invalid route: ${requestPath}`);
				}
				
				// return next(Boom.internal('Invalid route').output.payload);
			}

			const CheckSchema = schemaObject.validate(req[origin]).error;

			/**
			 * Check the Joi schema
			 */

			if (CheckSchema) {
				return next(Boom.badRequest(CheckSchema.toString().replace('ValidationError: ', '')).output.payload);
			}

			/**
			 * Replace the raw body to the Joi validated body
			 * This is helpful to prevent undefined values and use the replaced values from check schema
			 */

			if (schemaObject && req[origin] && origin == 'body') {
				req.body = schemaObject.validate(req[origin]).value;

				// req.body = { ownerId: 1 };
			}

			next();
		} catch (err) {
			console.error(err);

			next(err);
		}
	};
}
