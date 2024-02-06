import { EUserStatus, NModels } from '../../../global';
import { Bcrypt } from '../../../utils';

export const USER_PROFILES = {
	ADMIN: {
		firstName: 'Admin',
		secondName: '',
		firstLastName: 'User',
		secondLastName: '',
		email: 'admin@wearedev.co',
		status: EUserStatus.Active,
		typeId: 'CC',
		personalId: '423456789',
		password: Bcrypt.hashPassword({ password: 'WeAreBack123*' }),
		charge: '',
		photoURL: '',
		liderId: 0
	},
	LEADER: {
		firstName: 'Leader',
		secondName: '',
		firstLastName: 'User',
		secondLastName: '',
		email: 'leader@wearedev.co',
		status: EUserStatus.Active,
		typeId: 'CC',
		personalId: '523456789',
		dateOfBirth: '2023-05-04T23:28:43.762Z',
		password: Bcrypt.hashPassword({ password: 'WeAreBack123*' }),
		charge: '',
		photoURL: '',
		liderId: 0
	},
	COLLABORATOR: {
		firstName: 'Collaborator',
		secondName: '',
		firstLastName: 'User',
		secondLastName: '',
		email: 'collaborator@wearedev.co',
		status: EUserStatus.Active,
		typeId: 'CC',
		personalId: '523456789',
		dateOfBirth: '2023-05-04T23:28:43.762Z',
		password: Bcrypt.hashPassword({ password: 'WeAreBack123*' }),
		charge: '',
		photoURL: '',
		liderId: 0
	},
};

export const USERS: Array<NModels.User.TUser> = [USER_PROFILES.ADMIN, USER_PROFILES.LEADER, USER_PROFILES.COLLABORATOR];
