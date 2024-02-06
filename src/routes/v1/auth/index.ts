import { Router } from 'express';
import { Controllers } from '../../../controllers';
import { Validator } from '../../../middlewares';
import Joi from 'joi';
import { ValidateJWT1 } from '../../../middlewares/validate-jwt1';

const router = Router();

const Schemas = {
	Login: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	}),
};

router.post('/login', Validator({ schema: Schemas.Login }), Controllers.Auth.Login)
router.get('/renew', ValidateJWT1, Controllers.Auth.renew)

// .post('/forgot-password', Validator({ schema: Joi.object({}) }), Controllers.NotImplemented)
// .post('/verify-password', Validator({ schema: Joi.object({}) }), Controllers.NotImplemented)
// .patch('/reset-password', Validator({ schema: Joi.object({}) }), Controllers.NotImplemented);

export default router;
