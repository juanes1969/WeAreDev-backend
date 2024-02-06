import { DataTypes, Sequelize } from 'sequelize';
import { NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MProyectUser = (sequelize: Sequelize) => {
    const ProyectUser = sequelize.define<NIModels.IProyectUser>(
        Consts.DataBase.User.ProyectUser,
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            userId: { type: DataTypes.INTEGER, allowNull: true },
            proyectId: { type: DataTypes.INTEGER, allowNull: true },
            isActive: { type: DataTypes.BOOLEAN, allowNull: true },
        },
        { tableName: Consts.DataBase.User.ProyectUser, timestamps: true }
    );

    return (): typeof ProyectUser => ProyectUser;
};

export function setProyectUserAssociations() {
    const MProyectUser = Models.ProyectUser();
    MProyectUser.belongsTo(Models.Proyect(), { foreignKey: 'proyectId' }); // Asegúrate de agregar esta línea
    MProyectUser.belongsTo(Models.Users());
}