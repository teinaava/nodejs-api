import { Op } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { getOffestAndTotalPages } from '../utils.js';
import { Boards } from './Boards.js';
import { db as sequelize } from './db.js';
import { Users } from "./Users.js";

export class Messages extends Model {

    /**
     * Create new message. (Not a reply. For create a reply use CreateReplyAsync).
     * Return the status code and the object result.
     * @param {string} messageBody 
     * @param {number} boardId 
     * @param {number} authorId 
     * @param {number} parentId 
     * @returns 
     */
    static async createMessageAsync(messageBody, boardId, authorId) {
        if (messageBody && boardId && authorId) {

            let countBoards = await Boards.count({ where: { id: boardId } });
            let countUsers = await Users.count({ where: { id: authorId } });
            if (countBoards === 0 || countUsers === 0) {
                return {
                    code: 404,
                    result: {
                        message: `No such user and / or board. Found boards with id=${boardId} - ${countBoards}. ` +
                            `Found users with id=${authorId} - ${countUsers}`
                    }
                }
            }
            let message = await Messages.create({
                body: messageBody,
                boardId: boardId,
                userId: authorId,
            });
            return {
                code: 200,
                result: message
            }
        }
        else
            return {
                code: 400,
                result: { message: `Incorrect Data. Required: {body, boardId, userId }` }
            }
    }
    static async getMessagesByBoardIdAsync(boardId, page, limit, searchQuery) {
        let messages;
        const total = await Messages.count({where: {
            boardId: boardId
        }});
        if(total === 0){
            return {
                code: 404,
                result: {
                    message: `Board not found`
                }
            }
        }
        if (!searchQuery)
            searchQuery = '';
        if (page && limit) {
            let { offest, totalPages } = getOffestAndTotalPages(page, limit, total);
            messages = await Messages.findAll({
                where: {
                    boardId: boardId,
                    body: { [Op.like]: `%${searchQuery}%` }
                },
                limit: limit,
                offset: offest
            });
            messages.totalPages = totalPages;
        } else {
            messages = await Messages.findAll({
                where: {
                    boardId: boardId,
                    body: { [Op.like]: `%${searchQuery}%` }
                },
            });
        }
        return {
            code: 200,
            result: messages
        }
    }
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


