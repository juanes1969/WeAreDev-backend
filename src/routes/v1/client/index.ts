import { Router } from 'express';
import { Controllers } from '../../../controllers';

const router = Router();

router
	.get(
		'/listClient',
		Controllers.Client.ListClient
	)

	.post(
		'/registerClient',
		Controllers.Client.RegisterClient
	)

	.get(
		'/listClientName/:name',
		Controllers.Client.ListClientByName
	)

	


export default router;
