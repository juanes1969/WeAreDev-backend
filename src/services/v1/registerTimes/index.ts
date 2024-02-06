import moment from 'moment';
import { Op } from 'sequelize';
import { Models, sequelize } from '../../../libs';
import ExcelJS from 'exceljs';
import { Response } from 'express';
import * as streams from 'memory-streams';
import * as fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
// import pdfMake from 'pdfmake/build/pdfmake';
// import vfsFonts from 'pdfmake/build/vfs_fonts';
// import { TDocumentDefinitions } from 'pdfmake/interfaces';

function calculateDifferenceHours(fechaInicial: Date, fechaFinal: Date): any {

    const dateInit = moment(fechaInicial);
    const dateFinal = moment(fechaFinal);

    const result = Math.abs(dateFinal.diff(dateInit, 'hours'));

    return result;
}

async function Post({
    payload,
}: {
    payload: {
        userId: number,
        clientId: number,
        proyectId: number,
        data: Array<{
            date: Date,
            hoursDiary: number,
            isOvertime: boolean,
            description: string,
        }>,
        stateId: number,
    };
}) {
    // const timeRegisters = await Promise.all(payload.data.map(async (entry) => {
    //     const existingTimeRegister = await Models.TimeRegister().findOne({
    //         where: {
    //             userId: payload.userId,
    //             clientId: payload.clientId,
    //             proyectId: payload.proyectId,
    //             date: entry.date,
    //         },
    //     });

    //     if (existingTimeRegister) {
    //         throw new Error('Register already exists.');
    //     }

    //     const timeRegister = await Models.TimeRegister().create({
    //         userId: payload.userId,
    //         clientId: payload.clientId,
    //         proyectId: payload.proyectId,
    //         date: entry.date,
    //         hoursDiary: entry.hoursDiary,
    //         isOvertime: entry.isOvertime,
    //         description: entry.description,
    //         stateId: payload.stateId,
    //     });

    //     return timeRegister;
    // }));

    // return timeRegisters;

    const timeRegisters = await Promise.all(payload.data.map(async (entry) => {
        const existingTimeRegister = await Models.TimeRegister().findOne({
            where: {
                userId: payload.userId,
                clientId: payload.clientId,
                proyectId: payload.proyectId,
                date: entry.date,
            }
        });

        if (existingTimeRegister) {
            throw {
                message: 'Register already exist.',
            };
        }

        const timeRegister = await Models.TimeRegister().create({
            userId: payload.userId,
            clientId: payload.clientId,
            proyectId: payload.proyectId,
            date: moment(entry.date).toDate(),
            hoursDiary: entry.hoursDiary,
            isOvertime: entry.isOvertime,
            description: entry.description,
            stateId: payload.stateId,
        });

        return timeRegister;
    }));

    return timeRegisters;
}





async function ListAllGet() {

    const { count, rows } = await Models.TimeRegister().findAndCountAll({
        attributes: {
            exclude: ['userId'],
        }
    });

    if (count === 0) {
        throw {
            message: 'RegistersNotFound',
        };
    }
    return rows;
}

async function ListGetByIdApproval(userId: number) {


    const { count, rows } = await Models.TimeRegister().findAndCountAll({
        where: {
            userId: userId
        },
        attributes: {
            include: [
                [sequelize.literal('(SELECT "firstName" FROM users WHERE id = "userId")'), 'firstName'],
                [sequelize.literal('(SELECT "personalId" FROM users WHERE id = "userId")'), 'personalId'],
                [sequelize.literal('(SELECT "secondName" FROM users WHERE id = "userId")'), 'secondName'],
                [sequelize.literal('(SELECT "firstLastName" FROM users WHERE id = "userId")'), 'firstLastName'],
                [sequelize.literal('(SELECT "secondLastName" FROM users WHERE id = "userId")'), 'secondLastName'],
                [sequelize.literal('(SELECT "description" FROM client WHERE id = "clientId")'), 'clientId'],
                [sequelize.literal('(SELECT "description" FROM proyect WHERE id = "proyectId")'), 'proyectId'],
                [sequelize.literal('(SELECT "description" FROM state WHERE id = "stateId")'), 'estado'],
            ],
            exclude: ['clientId', 'proyectId']
        }
    })

    if (count === 0) {
        throw {
            message: 'RegisterNotFound',
        };
    }

    return rows
}

async function ListGetById(userId: number) {


    const { count, rows } = await Models.TimeRegister().findAndCountAll({
        where: {
            userId: userId
        }
    })

    if (count === 0) {
        throw {
            message: 'RegisterNotFound',
        };
    }

    return rows
}

async function DeleteGetById(id: number) {


    const TIME_REGISTER = await Models.TimeRegister().destroy({
        where: {
            id: id
        },
    })

    if (!TIME_REGISTER) {
        throw {
            message: 'RegisterNotFound',
        };
    }

    return { TIME_REGISTER }
}

async function PutStateAproval(userId: number) {
    const TIME_REGISTER = !!(await Models.TimeRegister().findOne({
        where: {
            userId: userId
        }
    }));

    if (!TIME_REGISTER) {
        throw {
            message: 'Register Time notFound',
        };
    }

    const TIME_REGISTER_UPDATE = await Models.TimeRegister().update({ stateId: 2 },
        {
            where: {
                stateId: 1,
                userId: userId
            },
        }
    );

    if (!TIME_REGISTER_UPDATE) {
        throw {
            message: 'userNotModified',
        };
    }

    return { userId: userId };
}

async function PutStateAprovalById(userId: number,
    {
        payload,
    }: {
        payload: {
            ids: number[]
        };
    }) {

    const TIME_REGISTER = !!(await Models.TimeRegister().findOne({
        where: {
            id: {
                [Op.in]: payload.ids
            },
            userId: userId,
            stateId: 1
        }
    }));

    if (!TIME_REGISTER) {
        throw {
            message: 'Register Time notFound',
        };
    }

    const TIME_REGISTER_UPDATE = await Models.TimeRegister().update(
        { stateId: 2 },
        {
            where: {
                stateId: 1,
                userId: userId,
                id: {
                    [Op.in]: payload.ids
                }
                // id: payload.ids
            }
        }
    );

    if (!TIME_REGISTER_UPDATE) {
        throw {
            message: 'userNotModified',
        };
    }

    return { userId: userId };
}

async function PutStateAprovalByIdNumber(userId: number,
    {
        payload,
    }: {
        payload: {
            id: number
        };
    }) {

    const TIME_REGISTER = !!(await Models.TimeRegister().findOne({
        where: {
            id: payload.id,
            userId: userId,
            stateId: 1
        }
    }));

    if (!TIME_REGISTER) {
        throw {
            message: 'Register Time notFound',
        };
    }

    const TIME_REGISTER_UPDATE = await Models.TimeRegister().update(
        { stateId: 2 },
        {
            where: {
                stateId: 1,
                userId: userId,
                id: payload.id
            }
        }
    );

    if (TIME_REGISTER_UPDATE[0] === 0) {
        throw {
            message: 'userNotModified',
        };
    }

    return { userId: userId };
}


async function PutStateRejectById(userId: number, {
    payload,
}: {
    payload: {
        ids: number[]
    };
}) {
    const TIME_REGISTER = !!(await Models.TimeRegister().findOne({
        where: {
            id: {
                [Op.in]: payload.ids
            },
            userId: userId,
            stateId: 1
        }
    }));

    if (!TIME_REGISTER) {
        throw {
            message: 'Register Time notFound',
        };
    }

    const TIME_REGISTER_UPDATE = await Models.TimeRegister().update(
        { stateId: 3 },
        {
            where: {
                stateId: 1,
                userId: userId,
                id: {
                    [Op.in]: payload.ids
                }
                // id: payload.ids
            }
        }
    );

    if (!TIME_REGISTER_UPDATE) {
        throw {
            message: 'userNotModified',
        };
    }

    return { userId: userId };
}

async function PutStateReject(userId: number) {
    const TIME_REGISTER = !!(await Models.TimeRegister().findOne({
        where: {
            userId: userId
        }
    }));

    if (!TIME_REGISTER) {
        throw {
            message: 'Register Time notFound',
        };
    }

    const TIME_REGISTER_UPDATE = await Models.TimeRegister().update({ stateId: 3 },
        {
            where: {
                stateId: 1,
                userId: userId
            },
        }
    );

    if (!TIME_REGISTER_UPDATE) {
        throw {
            message: 'userNotModified',
        };
    }

    return { userId: userId };
}
async function putState(id: number, {
    payload,
}: {
    payload: {
        userId: number,
        stateId: number
    };
}) {
    // console.log(id);
    // console.log(payload.userId);
    // console.log(payload.stateId);
    const TIME_REGISTER = !!(await Models.TimeRegister().findByPk(id));

    if (!TIME_REGISTER) {
        throw {
            message: 'Register Time notFound',
        };
    }

    const TIME_REGISTER_UPDATE = await Models.TimeRegister().update(
        {
            stateId: payload.stateId,
        },
        {
            where: {
                id: id,
                userId: payload.userId
            },
        }
    );

    if (!TIME_REGISTER_UPDATE) {
        throw {
            message: 'timeStateNotModify',
        };
    }

    return { id: id };
}


async function Patch({
    payload,
}: {
    payload: {
        userId: number,
        clientId: number,
        proyectId: number,
        data: Array<{
            date: Date,
            hoursDiary: number,
            isOvertime: boolean,
            description: string,
        }>
    };
}) {


    const timeRegisters = await Promise.all(payload.data.map(async (entry) => {
        const existingTimeRegister = await Models.TimeRegister().findOne({
            where: {
                userId: payload.userId,
                clientId: payload.clientId,
                proyectId: payload.proyectId,
                date: entry.date,
            }
        });

        if (!existingTimeRegister) {
            throw {
                message: 'Register Time notFound',
            };
        }


        const timeRegister = await Models.TimeRegister().update({
            clientId: payload.clientId,
            proyectId: payload.proyectId,
            date: moment(entry.date).toDate(),
            hoursDiary: entry.hoursDiary,
            isOvertime: entry.isOvertime,
            description: entry.description,
            stateId: 1
        }, {
            where: {
                clientId: payload.clientId,
                proyectId: payload.proyectId,
                date: entry.date
            },
        });

        return timeRegister;
    }));

    return timeRegisters;
}

// async function Patch({
//     payload,
// }: {
//     payload: {
//         clientId: string,
//         proyectId: string,
//         data: {
//             date: Date,
//             hoursDiary: number,
//             isOvertime: boolean,
//             description: string,
//         }[],
//         total: number,
//         stateId: string,
//     };
// }) {
//     const TIME_REGISTER = await Models.TimeRegister().findAll({
//         where: {
//             clientId: payload.clientId,
//             proyectId: payload.proyectId
//         }
//     });

//     if (TIME_REGISTER.length === 0) {
//         throw {
//             message: 'Register Time notFound',
//         };
//     }

//     const updatedDataPromises = payload.data.map(async (entry) => {
//         const updateEntry = await Models.TimeRegister().update({

//         })

//     });

//     const updatedDataResults = await Promise.all(updatedDataPromises);

//     if (!updatedDataResults.every(result => result[0] > 0)) {
//         throw {
//             message: 'userNotModified',
//         };
//     }

//     return { id: id }; // Aquí deberías devolver el ID de la entrada actualizada
// }


async function DownloadInExcel(res: Response, {
    payload,
}: {
    payload: {
        data: any[];
    };
}) {
    try {

        // Establecer todos los encabezados antes de enviar la respuesta
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Content-Disposition', 'attachment; filename=ejemplo.xlsx');

        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tiempos registrados');

        // Definir las columnas
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 5 },
            { header: 'Identificacion', key: 'personalId', width: 10 },
            { header: 'Nombre', key: 'firstName' + ' ' + 'secondName', width: 10 },
            { header: 'Apellidos', key: 'firstLastName' + ' ' + 'secondLastName', width: 10 },
            { header: 'Fecha', key: 'date', width: 15 },
            { header: 'Horas Diarias', key: 'hoursDiary', width: 15 },
            { header: 'Horas Extras', key: 'isOvertime', width: 15 },
            { header: 'Descripción', key: 'description', width: 20 },
            { header: 'Cliente', key: 'clientId', width: 15 },
            { header: 'Proyecto', key: 'proyectId', width: 15 },
            { header: 'Estado', key: 'estado', width: 10 },
            { header: 'Fecha de Creación', key: 'createdAt', width: 20 },
            { header: 'Fecha de Actualización', key: 'updatedAt', width: 20 },
        ];

        // Agregar filas con la data proporcionada
        payload.data.forEach((row) => {
            worksheet.addRow(row);
        });

        // Escribir el libro de Excel en un buffer
        const buffer = await workbook.xlsx.writeBuffer();


        // Enviar el buffer como respuesta
        if (!res.headersSent) {
            // Enviar el buffer como respuesta
            res.end(buffer, 'binary');
        } else {
            // Si los encabezados ya se han enviado, loguear un mensaje (puedes adaptar esto según tus necesidades)
            console.error('Los encabezados ya se han enviado antes de intentar enviar la respuesta.');
        }

        return;
    } catch (error) {
        console.error('Error en el servicio de descarga de Excel:', error);
        res.status(500).send('Error en el servicio de descarga de Excel');
        return;
    }
}

async function DownloadInPdf(res: Response, {
    payload,
}: {
    payload: {
        data: any[];
    };
}) {
    try {

        const dataEmployed = payload.data[0];

        const doc = new PDFDocument();

        // Configurar los encabezados para la respuesta PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Content-Disposition', 'attachment; filename=ejemplo.pdf');


        doc.text(`Reporte de tiempos del empleado ${dataEmployed.firstName} ${dataEmployed.secondName} ${dataEmployed.secondLastName}`, {
            align: 'justify', // Justificar el texto
            lineGap: 10, // Espacio entre líneas
        });

        doc.moveDown(); // Moverse a la siguiente línea después de los encabezados

        doc.text(`Fecha: ${dataEmployed.createdAt}`, {
            align: 'justify', // Justificar el texto
            lineGap: 10, // Espacio entre líneas
        });


        doc.moveDown();


        doc.text(`El colaborador ${dataEmployed.firstName} ${dataEmployed.secondName} ${dataEmployed.secondLastName} registró un total de [Total de Horas Trabajadas] horas trabajadas durante el periodo Febrero, con un promedio de ${dataEmployed.hoursDiary} horas trabajadas por día.`, {
            align: 'justify', // Justificar el texto
        });

        doc.moveDown();

        doc.text(`El total de horas adicionales acordadas previamente con el líder directo fue de [Horas adicionales durante el periodo] horas adicionales.`, {
            align: 'justify', // Justificar el texto
        });

        doc.moveDown();

        doc.text(`${dataEmployed.firstName} ${dataEmployed.secondName} ${dataEmployed.secondLastName}`, {
            align: 'justify', // Justificar el texto
        });

        doc.moveDown();

        doc.moveDown();

        doc.text(`[Cargo del Colaborador]`, {
            align: 'justify', // Justificar el texto
        });

        doc.moveDown();

        doc.text(`En caso de inquietudes o validaciones, su líder directo es [Nombre del líder directo]`, {
            align: 'justify', // Justificar el texto
        });

        doc.moveDown();

        doc.text(`WeAre dev SAS`, {
            align: 'justify', // Justificar el texto
        });






        // columns.forEach(column => {
        //     doc.text(column, { continued: true, width: 100 });
        // });

        // // Crear el contenido del PDF utilizando las columnas y los datos
        // payload.data.forEach((row) => {
        //     columns.forEach(column => {
        //         doc.text(String(row[column]), { continued: true, width: 100 });
        //     });
        //     doc.moveDown(); // Moverse a la siguiente línea después de una fila
        // });



        // Finalizar la respuesta
        doc.end();


        // Pipe the PDF into the response stream
        doc.pipe(res);

        // Finalizar la respuesta
        doc.end();

        return;
    } catch (error) {
        console.error('Error en el servicio de descarga de PDF:', error);
        res.status(500).send('Error en el servicio de descarga de PDF');
        return;
    }
}


export default {
    Post,
    ListAllGet,
    ListGetById,
    ListGetByIdApproval,
    Patch,
    PutStateAproval,
    PutStateAprovalById,
    PutStateAprovalByIdNumber,
    PutStateReject,
    PutStateRejectById,
    putState,
    DeleteGetById,
    DownloadInExcel,
    DownloadInPdf
}