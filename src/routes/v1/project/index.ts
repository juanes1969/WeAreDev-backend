import { Router } from 'express';
import { Controllers } from '../../../controllers';

const router = Router();

router
	.get(
		'/listProject',
		Controllers.Project.ListProject
	)

	.get(
		'/listProyectAndClient/:userId',
		Controllers.Project.ListProjectAndClientByUserId
	)

	.get(
		'/listProyectAndClientAssigned',
		Controllers.Project.ListAllProjectAndClientAssigned
	)

	.post(
		'/registerProyect',
		Controllers.Project.CreateProject
	)

	.post(
		'/assingProyect',
		Controllers.Project.AssingProject
	)

	.put(
		'/updateState/:projectId',
		Controllers.Project.ChangeStateDesactive
	)

	.put(
		'/updateStateAssignement/:projectId',
		Controllers.Project.ChangeStateDesactiveAssignement
	)

	.put('/updateProject',
		Controllers.Project.updateProject
	)

export default router;
