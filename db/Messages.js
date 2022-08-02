import { DataTypes, Model } from 'sequelize';
import { Boards } from './Boards.js';
import { db as sequelize } from './db.js';
import { Users } from "./Users.js";

export class Messages extends Model {
}
Messages.init({
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
    sequelize,
    freezeTableName: true,
})



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

