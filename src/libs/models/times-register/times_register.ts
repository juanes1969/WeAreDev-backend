import { DataTypes, Sequelize } from 'sequelize';
import { NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MTimeRegister = (sequelize: Sequelize) => {
    const TimeRegister = sequelize.define<NIModels.ITimeregister>(
        Consts.DataBase.User.TimeRegister,
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            userId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
            clientId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
            proyectId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
            date: { type: DataTypes.DATE, primaryKey: true, allowNull: false },
            hoursDiary: { type: DataTypes.DECIMAL, allowNull: true },
            isOvertime: { type: DataTypes.BOOLEAN, allowNull: true },
            description: { type: DataTypes.STRING, allowNull: true },
            stateId: { type: DataTypes.INTEGER, allowNull: true },
        },
        { tableName: Consts.DataBase.User.TimeRegister, timestamps: true }
    );
    return (): typeof TimeRegister => TimeRegister;
};

export function setTimeRegisterAssociations() {
    const MTimeRegister = Models.TimeRegister();
    MTimeRegister.belongsTo(Models.Users());
}
