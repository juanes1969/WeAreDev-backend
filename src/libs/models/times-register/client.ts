import { DataTypes, Sequelize } from 'sequelize';
import { NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MClient = (sequelize: Sequelize) => {
    const Client = sequelize.define<NIModels.IClient>(
        Consts.DataBase.User.Client,
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            description: { type: DataTypes.STRING, allowNull: true }            
        },
        { tableName: Consts.DataBase.User.Client, timestamps: true }
    );

    return (): typeof Client => Client;
};

export function setClientAssociations() {
    const MClient = Models.Client();
    
}