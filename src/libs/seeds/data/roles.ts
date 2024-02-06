import { EUserRole, NModels } from '../../../global';

export const ROLES: Array<NModels.User.TRole> = [
	{
		description: 'Admin',
		role: EUserRole.Admin,
	},
	{
		description: 'Leader',
		role: EUserRole.Leader,
	},
	{
		description: 'Collaborator',
		role: EUserRole.Collaborator,
	}
];
