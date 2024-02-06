/* eslint-disable @typescript-eslint/no-explicit-any */
import { default as Cors } from 'cors';
import express, { json as Json } from 'express';
import Moment from 'moment';
import { default as Morgan } from 'morgan';
import Chalk from 'chalk';
// import Helmet from 'helmet';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

import { Config } from './utils';
import { Handlers } from './middlewares';
import { routesV1, routerHealthCheck } from './routes';

const app = express();

function Color(value: unknown) {
	if (typeof value === 'boolean' && value) return Chalk.green(value);
	else if (typeof value === 'boolean' && !value) return Chalk.red(value);

	return value;
}

const LogDev = `\x1Bc┌ ${Chalk.blue(`Running in ${Config().NODE_ENV}`)}
├ 
├ DB_LOGGING: ${Color(Config().DB_LOGGING)}
├ DB_SYNC: ${Color(Config().DB_SYNC)}
├ DB_PORT: ${Color(Config().DB_PORT)}
├ SV_PORT: ${Color(Config().SV_PORT)}
├ 
`;

const LogPro = Chalk.blue(`Running in ${Config().NODE_ENV}`);

process.stdout.write(Config().NODE_ENV === 'production' ? LogPro : LogDev);

app.use(
	Json(),
	// Helmet(),
	Cors({
		origin: '*',
		optionsSuccessStatus: 200,
	}),
	Morgan((tokens, req, res) => {
		const date = Moment().format('MMMM DD YYYY HH:mm:ss A [[]Z[]]').toString();
		const method = (tokens.method(req, res) || '0').toString().padEnd(8, '\x20').toString();
		const status = tokens.status(req, res)?.toString();
		const responseTime = `${tokens['response-time'](req, res)} ms`;
		const url = tokens.url(req, res)?.toString();
		const body = req.body ? JSON.stringify(req.body, null, 2) : '';
		// const headers = req.headers ? JSON.stringify(req.headers.authorization, null, 2) : '';
		const headers = req.headers ? JSON.stringify(req.headers, null, 2) : '';

		return Config().NODE_ENV === 'production'
			? `\n┌\x20${date}\x20|\x20${status}\x20|\x20${method}\x20|\x20${responseTime}\nbody:\x20${body}\nheaders:\x20${headers}\n└ ${url}`
			: `| ${date} | ${status} | ${method} | ${url}`;
	})
);

// app.use((req: Request, res: Response, next: NextFunction) => {
// 	res.header('Content-Type', 'application/json');

// 	const defaultSend = res.send.bind(res);
// 	try {
// 		res.send = async function (body: object) {
// 			defaultSend.call(res, await Encrypt(body));
// 		} as any;

// 		next();
// 	} catch (error) {
// 		next(error);
// 	}
// });

// app.use(
// 	'/api-docs',
// 	swaggerUi.serve,
// 	swaggerUi.setup(
// 		swaggerJsdoc({
// 			swaggerDefinition: {
// 				openapi: '3.0.0',
// 				info: {
// 					title: 'Base API',
// 					version: '1.0.0',
// 				},
// 				description: "API'S for base project",
// 				servers: [
// 					{
// 						url: `http://localhost:${process.env.PORT || 3001}`,
// 					},
// 				],
// 			},
// 			apis: ['./src/routes/v1/**/*.ts'],
// 		})
// 	)
// );

app.use('/v1/', routesV1);
app.use('/', routerHealthCheck);

app.use(Handlers.NotFound);

app.use(Handlers.ErrorHandler);

app.listen(Config().SV_PORT || 3002);
