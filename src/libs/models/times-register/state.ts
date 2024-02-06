import { DataTypes, Sequelize } from 'sequelize';
import { NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MState = (sequelize: Sequelize) => {
    const State = sequelize.define<NIModels.IState>(
        Consts.DataBase.User.State,
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            description: { type: DataTypes.STRING, allowNull: true }
        },
        { tableName: Consts.DataBase.User.State, timestamps: true }
    );

    return (): typeof State => State;
};

export function setStateAssociations() {
    const MState = Models.State();

    MState.hasMany(Models.TimeRegister(), { foreignKey: 'stateId' });
}