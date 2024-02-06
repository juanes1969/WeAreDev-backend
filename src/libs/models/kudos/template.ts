import { DataTypes, Sequelize } from 'sequelize';
import { NIModels } from '../../../global';
import { Consts } from '../../../utils';
import { Models } from '../../db';

export const MTemplate = (sequelize: Sequelize) => {
    const Template = sequelize.define<NIModels.ITemplate>(
        Consts.DataBase.User.Template,
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            template: { type: DataTypes.TEXT, allowNull: true }
        },
        { tableName: Consts.DataBase.User.Template, timestamps: true }
    );

    return (): typeof Template => Template;
};

export function setTemplateAssociations() {
    const MTemplate = Models.Templates();

    MTemplate.hasMany(Models.KudosRegister(), { foreignKey: 'templateId' });
    //MTemplate.belongsTo(Models.KudosRegister(), { foreignKey: 'templateId' });

}