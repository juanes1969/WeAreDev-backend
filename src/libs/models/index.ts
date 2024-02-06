

import { MRoles, MUsers, setUsersAssociations, setRolesAssociations } from './users';
import { MTimeRegister, setTimeRegisterAssociations, MClient, setClientAssociations, MState, setStateAssociations, MProyect, MProyectUser, setProyectAssociations, setProyectUserAssociations } from './times-register'
import { MKudosRegister, MTemplate, setKudosRegisterAssociations, setTemplateAssociations } from './kudos';

export const Models = {
	MUsers,
	MRoles,
	MTimeRegister,
	MClient,
	MState,
	MProyect,
	MProyectUser,
	MKudosRegister,
	MTemplate
};

export const ModelsAssociations = [
	setUsersAssociations,
	setRolesAssociations,
	setClientAssociations,
	setProyectAssociations,
	setProyectUserAssociations,
	setTimeRegisterAssociations,
	setStateAssociations,
	setKudosRegisterAssociations,
	setTemplateAssociations
];
