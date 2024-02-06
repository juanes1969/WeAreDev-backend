import { Controllers } from '../../../controllers';
import Joi from 'joi';
import { Validator } from '../../../middlewares';
import { Router } from 'express';


const router = Router();

const Schemas = {
    Kudos: Joi.object({
        description: Joi.string().required(),
        userSendId: Joi.number().required(),
        userReceiveEmail: Joi.string().required(),
        icon: Joi.string().required(),
        colorIcon: Joi.string().required(),
        colorCard: Joi.string().required(),
        templateId: Joi.number().required()
    })
};

router.post('/register', Validator({ schema: Schemas.Kudos }), Controllers.Kudos.sendKudoMail)
router.get('/byEmail/:email', Controllers.Kudos.getByEmail)
// router.get('/getKudoId/:id', Controllers.Kudos.ListRoles)



export default router;   