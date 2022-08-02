import { DataTypes } from 'sequelize';
import { db } from './db.js';

export const Users = db.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    login:{
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    freezeTableName: true
}
);
// Relationship many-to-many. Many users may have many rules.
// TODO:
// Users.belongsToMany(Rules,{through: 'UserRules'});
// Rules.belongsToMany(Users,{through: 'UserRules'});

 
