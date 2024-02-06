import Joi from 'joi';

const JoiObject = {
	GetAll: Joi.object({
		page: Joi.number().required(),
		limit: Joi.number().required(),
	}),
};

export { JoiObject };
