import { DataTypes, Sequelize } from 'sequelize';
import { NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MKudosRegister = (sequelize: Sequelize) => {
    const KudosRegister = sequelize.define<NIModels.IKudos>(
        Consts.DataBase.User.KudosRegister,
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            description: { type: DataTypes.STRING, allowNull: true },
            userSendId: { type: DataTypes.INTEGER, allowNull: true },
            userReceiveEmail: { type: DataTypes.STRING, allowNull: true },
            icon: { type: DataTypes.STRING, allowNull: false },
            colorIcon: { type: DataTypes.STRING, allowNull: false },
            colorCard: { type: DataTypes.STRING, allowNull: false },
            templateId: { type: DataTypes.INTEGER, allowNull: true }
        },
        { tableName: Consts.DataBase.User.KudosRegister, timestamps: true }
    );

    return (): typeof KudosRegister => KudosRegister;
};

export function setKudosRegisterAssociations() {
    const MKudosRegister = Models.KudosRegister();

    MKudosRegister.belongsTo(Models.Templates());
}