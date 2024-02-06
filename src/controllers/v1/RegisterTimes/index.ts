import { NextFunction, Request, Response } from 'express';
import { Services } from '../../../services';
import { Replica } from '../../../utils';

async function Post(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.Post({ payload: req.body });

        Replica(res, {
            message: 'RegisterTimeCreated',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
};


async function GetAll(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.ListAllGet();

        Replica(res, {
            message: 'RegisterTimeList',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
}

async function GetById(req: Request, res: Response, next: NextFunction) {
    try {

        const DataRest = await Services.RegisterTimes.ListGetById(parseInt(req.params.userId));

        Replica(res, {
            message: 'RegisterTimeList',
            data: DataRest,
        });

    } catch (error) {
        next(error);
    }
}

async function GetByIdAproval(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.ListGetByIdApproval(parseInt(req.params.userId));

        Replica(res, {
            message: 'RegisterTimeList',
            data: DataRest,
        });

    } catch (error) {
        next(error);
    }
}

async function Patch(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.Patch({ payload: req.body });

        Replica(res, {
            message: 'UserModified',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
}

async function PutAproval(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.PutStateAproval(parseInt(req.params.userId));

        Replica(res, {
            message: 'UserModified',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
}

async function PutAprovalById(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.PutStateAprovalById(parseInt(req.params.userId), { payload: req.body });

        Replica(res, {
            message: 'UserModified',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
}

async function PutAprovalByIdNumber(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.PutStateAprovalByIdNumber(parseInt(req.params.userId), { payload: req.body });

        Replica(res, {
            message: 'UserModified',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
}

async function PutRejectById(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.PutStateRejectById(parseInt(req.params.userId), { payload: req.body });

        Replica(res, {
            message: 'UserModified',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
}

async function PutReject(req: Request, res: Response, next: NextFunction) {
    try {
        const DataRest = await Services.RegisterTimes.PutStateReject(parseInt(req.params.userId));

        Replica(res, {
            message: 'UserModified',
            data: DataRest,
        });
    } catch (error) {
        next(error);
    }
}


async function DeleteById(req: Request, res: Response, next: NextFunction) {
    try {

        const DataRest = await Services.RegisterTimes.DeleteGetById(parseInt(req.params.id));

        Replica(res, {
            message: 'RegisterTimeList',
            data: DataRest,
        });

    } catch (error) {
        next(error);
    }
}

async function putStateTimeController(req: Request, res: Response, next: NextFunction) {
    try {

        const DataRest = await Services.RegisterTimes.putState(parseInt(req.params.id), { payload: req.body });

        Replica(res, {
            message: 'RegisterTimeList',
            data: DataRest,
        });

    } catch (error) {
        next(error);
    }
}

async function downloadExcel(req: Request, res: Response, next: NextFunction) {
    try {
        // Verificar que req.body sea un array
        if (Array.isArray(req.body)) {
            const data = await Services.RegisterTimes.DownloadInExcel(res, { payload: { data: req.body } });
            Replica(res, {
                message: 'RegisterTimeList',
                data: { data }
            });
        } else {
            // Manejar el caso en el que req.body no es un array
            console.error('Error: req.body no es un array.');
            // Puedes manejar este caso de acuerdo a tus necesidades.
        }
    } catch (error) {
        next(error);
    }
}
async function downloadPDF(req: Request, res: Response, next: NextFunction) {
    try {
        // Verificar que req.body sea un array
        if (Array.isArray(req.body)) {
            const data = await Services.RegisterTimes.DownloadInPdf(res, { payload: { data: req.body } });
            Replica(res, {
                message: 'RegisterTimeList',
                data: { data }
            });
        } else {
            // Manejar el caso en el que req.body no es un array
            console.error('Error: req.body no es un array.');
            // Puedes manejar este caso de acuerdo a tus necesidades.
        }
    } catch (error) {
        next(error);
    }
}

export default {
    Post,
    GetAll,
    GetById,
    GetByIdAproval,
    PutAprovalByIdNumber,
    Patch,
    PutAproval,
    PutAprovalById,
    PutReject,
    PutRejectById,
    putStateTimeController,
    DeleteById,
    downloadExcel,
    downloadPDF
};