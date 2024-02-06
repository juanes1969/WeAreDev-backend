import { Router } from 'express';
import { Controllers } from '../../../controllers';
import { JoiObject } from '../../../utils';
import { Validator } from '../../../middlewares';
import Joi from 'joi';
import { EUserRole } from 'global';
import { ValidateJWT1 } from '../../../middlewares/validate-jwt1';

const router = Router();

router
	.get(
		'/list',
		// Validator({
		// 	schema: JoiObject.GetAll,
		// }),
		Controllers.Users.ListPost
	)
	// .get(
	// 	'/listAll',
	// 	// Validator({
	// 	// 	schema: JoiObject.GetAll,
	// 	// }),
	// 	Controllers.Users.ListAllPost
	// )
	.get(
		'/listAllUsers',
		Controllers.Users.ListAllUser
	)

	.get('/listEmployed/:leaderId',
		Controllers.Users.GetByLeader
	)

	.post(
		'/created',
		Validator({
			schema: Joi.object({
				firstName: Joi.string().required(),
				secondName: Joi.string().allow('', null),
				firstLastName: Joi.string().required(),
				secondLastName: Joi.string().allow('', null),
				email: Joi.string().email().required(),
				role: Joi.string().allow(EUserRole.Admin, EUserRole.Leader, EUserRole.Collaborator).required(),
				typeId: Joi.string().required(),
				personalId: Joi.string().required(),
				password: Joi.string().required(),
				photoURL: Joi.string().allow('', null),
				charge: Joi.string().required(),
				liderId: Joi.number().required()
			}),
		}),
		Controllers.Users.Post
	)
	.patch(
		'/',
		Validator({
			schema: Joi.object({
				id: Joi.number().required(),
				firstName: Joi.string(),
				secondName: Joi.string().allow('', null),
				firstLastName: Joi.string(),
				secondLastName: Joi.string().allow('', null),
				email: Joi.string().email().allow('', null),
				password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
			}),
		}),
		Controllers.Users.Patch
	)

export default router;
