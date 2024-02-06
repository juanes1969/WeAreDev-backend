import { Model } from 'sequelize';

/* eslint-disable @typescript-eslint/no-empty-interface */
// # Enums

export const enum EUserRole {
	Admin = 'admin',
	Leader = 'leader',
	Collaborator = 'collaborator',
}

export const enum EUserStatus {
	Created = 'created',
	Active = 'active',
	Inactive = 'inactive',
}

// # Interfaces

interface ModelBase {
	id?: number;
	maskedUId?: string;
	updatedBy?: number;
	createdBy?: number;
	createdAt?: string;
	updatedAt?: string;
}

// # Models

export namespace NModels {
	// ## TCV

	export namespace User {
		export interface TUser extends ModelBase {
			firstName: string;
			secondName: ?string;
			firstLastName: string;
			secondLastName: ?string;
			email: string;
			status: EUserStatus;
			typeId: ?EIdType;
			personalId: ?string;
			password: ?string;
			roles?: string[];
			rolesArray?: string[];
			photoURL: string;
			charge: string;
			liderId: number;
		}
		export interface TRole extends ModelBase {
			description: string;
			role: EUserRole;
		}
	}

	export namespace TimeRegister {
		export interface Time extends ModelBase {
			userId: number;
			clientId: number;
			proyectId: number;
			date: Date;
			hoursDiary: number;
			isOvertime: boolean;
			description: string;
			stateId: number;
		}

		export interface ProyectUser extends ModelBase {
			userId: number;
			proyectId: number;
			isActive: boolean;
		}

		export interface Client extends ModelBase {
			description: string;
		}
		export interface State extends ModelBase {
			description: string;
		}
		export interface Proyect extends ModelBase {
			description: string;
			clientId: number;
			isActive: boolean;
		}

	}

	export namespace KudosRegister {
		export interface Kudos extends ModelBase {
			description: string,
			userSendId: number,
			userReceiveEmail: string,
			icon: string,
			colorIcon: string,
			colorCard: string,
			templateId: number
		}

		export interface Template extends ModelBase {
			template: string;
		}

	}
}


export namespace NIModels {
	export interface IUserRoles extends Model<NModels.User.TRole>, NModels.User.TRole { }

	export interface IUsers extends Model<NModels.User.TUser>, NModels.User.TUser {
		addRoles(role: IRoles | IRoles[]): unknown;
	}

	export interface ITimeregister extends Model<NModels.TimeRegister.Time>, NModels.TimeRegister.Time { }

	export interface IProyectUser extends Model<NModels.TimeRegister.ProyectUser>, NModels.TimeRegister.ProyectUser { }

	export interface IClient extends Model<NModels.TimeRegister.Client>, NModels.TimeRegister.Client { }

	export interface IState extends Model<NModels.TimeRegister.State>, NModels.TimeRegister.State { }

	export interface IProyect extends Model<NModels.TimeRegister.Proyect>, NModels.TimeRegister.Proyect { }


	export interface IKudos extends Model<NModels.KudosRegister.Kudos>, NModels.KudosRegister.Kudos { }

	export interface ITemplate extends Model<NModels.KudosRegister.Template>, NModels.KudosRegister.Template { }
}
