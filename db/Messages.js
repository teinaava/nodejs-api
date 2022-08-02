import { DataTypes } from 'sequelize';
import { Boards } from './Boards.js';
import { db } from './db.js';
import { Users } from "./Users.js";
export const Messages = db.define('Messages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},
    {
        freezeTableName: true
    });

Boards.hasMany(Messages, {
    targetKey: 'id',
    foreignKey: {
        name: 'boardId',
        allowNull: false
    }
})
Messages.belongsTo(Messages, {
    as: 'parent',
    targetKey: 'id',
    foreignKey: {
        allowNull: true,
        defaultValue: null
    }
});
Users.hasMany(Messages, {
    targetKey: 'id',
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
});

