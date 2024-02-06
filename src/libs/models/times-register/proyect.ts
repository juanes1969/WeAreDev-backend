import { DataTypes, Sequelize } from 'sequelize';
import { NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MProyect = (sequelize: Sequelize) => {
    const Proyect = sequelize.define<NIModels.IProyect>(
        Consts.DataBase.User.Proyect,
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            description: { type: DataTypes.STRING, allowNull: false },
            clientId: { type: DataTypes.INTEGER, allowNull: false },
            isActive: { type: DataTypes.BOOLEAN, allowNull: false },
        },
        { tableName: Consts.DataBase.User.Proyect, timestamps: true }
    );

    return (): typeof Proyect => Proyect;
};

export function setProyectAssociations() {
    const MProyect = Models.Proyect();
    MProyect.hasMany(Models.ProyectUser(), { foreignKey: 'proyectId' });
    MProyect.belongsTo(Models.Client(), { foreignKey: 'clientId' });    
}