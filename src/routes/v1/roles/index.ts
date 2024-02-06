import { Router } from 'express';
import { Controllers } from '../../../controllers';

const router = Router();

router
	.get(
		'/listRoles',
		Controllers.Roles.ListRoles
	)

export default router;
