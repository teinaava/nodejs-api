import { DataTypes, Model } from 'sequelize';
import { getOffestAndTotalPages } from '../utils.js';
import { db as sequelize } from './db.js';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;


export class Boards extends Model {

    /**
     * Creates a board and return it on success, otherwise return an error message. Returns object-result and status code
     * @param {string} name 
     * @param {string} description 
     * @returns {object} {code, result}
     */
    static async createBoardAsync(name, description) {
        let dublicate = await Boards.count({ where: { name: name } });
        if (dublicate > 0) {
            return {
                code: 400,
                result: {
                    message: 'board with the same name already exist'
                }
            }
        } else {
            const board = await Boards.create({
                name: name,
                description: description
            });
            return {
                code: 200,
                result: board
            }
        }
    }

    /**
     * @param {number} limit elements per page
     * @param {number} page number of page 
     * @param {string} searchQuery search by name
     * @returns {Object}
     */
    static async GetBoardsAsync(limit, page, searchQuery) {
        let total = await Boards.count();
        let result;
        if (!searchQuery)
            searchQuery = '';
        if (limit && page) {
            let { offest, totalPages } = await getOffestAndTotalPages(page, limit, total);
            let { rows, count } = await Boards.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${searchQuery}%` }
                },
                offset: offest,
                limit: limit
            });
            result = {
                boards: rows,
                totalBoards: count,
                totalPages: totalPages
            }
        } else {
            let { rows, count } = await Boards.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${searchQuery}%` }
                },
            });
            result = {
                boards: rows,
                totalBoards: count,
            }
        }
        return result;
    }
}
Boards.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'Boards'
});
