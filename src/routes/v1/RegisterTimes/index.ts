import { Controllers } from '../../../controllers';
import Joi from 'joi';
import { Validator } from '../../../middlewares';
import { Router } from 'express';


const router = Router();

const Schemas = {
    RegisterTimes: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
        isOvertime: Joi.boolean().required(),
        userId: Joi.number(),
        clientId: Joi.number(),
        proyectId: Joi.number(),
        stateId: Joi.number()
    })
};

router.post('/register', Controllers.RegisterTimes.Post)
router.get('/listAll', Controllers.RegisterTimes.GetAll)
router.get('/getId/:userId', Controllers.RegisterTimes.GetById)
router.get('/getIdByAproval/:userId', Controllers.RegisterTimes.GetByIdAproval)
// router.get('getEventsById/:userId',)
router.put('/update', Controllers.RegisterTimes.Patch)
router.put('/updateAproval/:userId', Controllers.RegisterTimes.PutAproval)
router.put('/updateAprovalById/:userId', Validator({ schema: Joi.object({ ids: Joi.array().items(Joi.number()).required() }) }), Controllers.RegisterTimes.PutAprovalById)
router.put('/updateAprovalByIdNumber/:userId', Validator({ schema: Joi.object({ id: Joi.array().items(Joi.number()).required() }) }), Controllers.RegisterTimes.PutAprovalByIdNumber)
router.put('/updateReject/:userId', Controllers.RegisterTimes.PutRejectById)
router.put('/updateState/:id', Controllers.RegisterTimes.putStateTimeController)
// router.put('/updateRejectById/:userId', Controllers.RegisterTimes.PutReject)
router.delete('/delete/:id', Controllers.RegisterTimes.DeleteById);
router.post('/downloadExcel', Controllers.RegisterTimes.downloadExcel);
router.post('/downloadPDF', Controllers.RegisterTimes.downloadPDF);


export default router;   