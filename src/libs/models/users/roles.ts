import { DataTypes, Sequelize, UUIDV4 } from 'sequelize';
import { EUserRole, NIModels } from '../../../global';
import { Consts } from '../../../utils/consts';
import { Models } from '../../db';

export const MRoles = (sequelize: Sequelize) => {
	const Roles = sequelize.define<NIModels.IUserRoles>(
		Consts.DataBase.User.Roles,
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			maskedUId: { type: DataTypes.UUID, defaultValue: UUIDV4, allowNull: false, unique: true },
			description: { type: DataTypes.STRING, allowNull: true },
			role: {
				type: DataTypes.ENUM,
				allowNull: false,
				values: [EUserRole.Admin, EUserRole.Leader, EUserRole.Collaborator],
				unique: {
					name: 'roles',
					msg: 'role exists',
				},
			},
		},
		{ tableName: Consts.DataBase.User.Roles, timestamps: true }
	);

	return (): typeof Roles => Roles;
};

export function setRolesAssociations() {
	const MRoles = Models.Roles();

	MRoles.belongsToMany(Models.Users(), {
		through: Consts.DataBase.User.UserRoles,
	});
}
