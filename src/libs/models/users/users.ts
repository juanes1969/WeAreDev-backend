import { DataTypes, STRING, Sequelize, UUIDV4 } from 'sequelize';
import { EUserStatus, NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MUsers = (sequelize: Sequelize) => {
	const User = sequelize.define<NIModels.IUsers>(
		Consts.DataBase.User.Users,
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			maskedUId: { type: DataTypes.UUID, defaultValue: UUIDV4, allowNull: false, unique: true },
			firstName: { type: DataTypes.STRING, allowNull: false },
			secondName: { type: DataTypes.STRING, allowNull: true },
			firstLastName: { type: DataTypes.STRING, allowNull: false },
			secondLastName: { type: DataTypes.STRING, allowNull: true },
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			status: {
				type: DataTypes.ENUM,
				allowNull: false,
				defaultValue: EUserStatus.Created,
				values: [
					EUserStatus.Active,
					EUserStatus.Created,
					EUserStatus.Inactive,
				],
			},
			typeId: {
				type: STRING,
				allowNull: true,

			},
			personalId: { type: DataTypes.STRING, allowNull: true },
			password: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
			photoURL: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
			charge: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
			liderId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null }
		},
		{ tableName: Consts.DataBase.User.Users, timestamps: true }
	);

	return (): typeof User => User;
};

export function setUsersAssociations() {
	const MUsers = Models.Users();

	MUsers.hasMany(Models.TimeRegister(), { foreignKey: 'userId' });
	MUsers.hasMany(Models.ProyectUser(), { foreignKey: 'userId' });
	MUsers.hasMany(Models.KudosRegister(), { foreignKey: 'userSendId' });
	MUsers.belongsToMany(Models.Roles(), { through: Consts.DataBase.User.UserRoles });

}
