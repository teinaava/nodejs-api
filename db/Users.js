import { DataTypes, Model } from 'sequelize';
import { db as sequelize } from './db.js';
import { getOffestAndTotalPages } from '../utils.js';
import Sequelize from 'sequelize';
import jwt from "jsonwebtoken";
export const jwtKey = 'keykey';
const Op = Sequelize.Op;

export class Users extends Model {

    static async createUserAsync(name, login, password) {
        if (name && password && login) {
            const count = await Users.count({
                where: { login: login }
            });
            if (count == 0) {
                const user = {
                    login: login,
                    name: name,
                    password: password
                };
                const record = await Users.create(user);
                return {
                    code: 201,
                    result: {
                        login: record.login,
                        name: record.name
                    }
                }
            } else
                return {
                    code: 400,
                    result: {
                        message: 'User with this login already exists'
                    }
                }
        }
        else {
            return {
                code: 400,
                result: {
                    message: 'Invalid data. Required {login, name, password}'
                }
            }
        }
    }

    static async getAllUsersAsync(limit, page, searchQuery) {
        let total = await Users.count();
        if (!searchQuery)
            searchQuery = '';
        if (limit && page) {
            let { totalPages, offest } = getOffestAndTotalPages(page, limit, total);
            let { rows, count } = await Users.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${searchQuery}%` }
                },
                limit: limit,
                offset: offest,
                attributes: {
                    exclude: ['password', 'updatedAt']
                },
            });
            return {
                code: 200,
                result: {
                    totalPages: totalPages,
                    totalUsers: total,
                    resultCount: count,
                    page: page,
                    limit: limit,
                    users: rows
                }
            }
        } else {
            let { rows, count } = await Users.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${searchQuery}%` }
                },
                attributes: {
                    exclude: ['password', 'updatedAt']
                },
            });
            return {
                code: 200,
                result: {
                    totalUsers: total,
                    users: rows
                }
            }
        }
    }
    static async deleteUserAsync(userId) {
        try {
            const user = await Users.findOne({ where: { id: userId } });
            const count = await Users.destroy({
                where: { id: userId }
            });
            if (count === 0)
                return {
                    code: 404,
                    result: {
                        message: `User with the id equlas ${userId} does not exist`
                    }
                }
            else
                return {
                    code: 204,
                    result: {
                        deletedUser: user
                    }
                }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
        }
    }
    static async editUserAsync(userId, user) {
        let { count, rows } = await Users.findAndCountAll({
            where: { id: userId }
        });
        if (user.login) {
            let countByLogin = await Users.count({
                where: {
                    login: user.login,
                    id: {[Op.not]: userId}  
                }
            });
            if (countByLogin > 0) {
                return {
                    code: 400,
                    result: { message: 'login name not allowed' }
                }
            }
        }
        if (count === 0)
            return {
                code: 404,
                result: {
                    message: `User with id ${userId} does not exist`
                }
            }
        else {
            let toEditUser = rows[0];
            for (let field in user) {
                toEditUser[field] = user[field];
            }
            await Users.update({
                login: toEditUser.login,
                name: toEditUser.name
            }, {
                where: { id: userId },
            });
            let newUser = await Users.findOne({
                where: { id: userId },
                attributes: {
                    exclude: ['password']
                },
            })
            return {
                code: 200,
                result: newUser
            }
        }
    }
    static async auth(login, password) {
        if (login && password) {
            let { rows, count } = await Users.findAndCountAll({
                where: {
                    login: login,
                    password: password
                },
                attributes: {
                    exclude: ['password']
                }
            });
            if (count > 0) {
                return {
                    code: 200,
                    result: {
                        user: rows[0]
                    }
                }
            }
            return {
                code: 404,
                result: {
                    message: 'Invalid login or password'
                }
            }

        }
        else {
            return {
                code: 400,
                result: {
                    message: 'Invalid request data'
                }
            }
        }

    }
    static async changePassword(newPassword, currentPassword, userId) {
        if (newPassword && currentPassword && userId) {
            let user = await Users.findOne({
                where: { id: userId }
            });
            if (!user) {
                return {
                    code: 404,
                    result: {
                        message: 'User not found'
                    }
                }
            }
            if (user.password == currentPassword) {
                await Users.update({
                    password: newPassword
                },
                    { where: { id: userId } });
                return {
                    code: 200,
                    result: {
                        message: 'success'
                    }
                }
            } else {
                return {
                    code: 403,
                    result: {
                        message: 'Invalid current password'
                    }
                }
            }
        }
        else {
            return {
                code: 402,
                result: {
                    message: 'Invalid request body, must be {currentPassword, newPassword}'
                }
            }
        }
    }
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    login: {
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
},
    {
        sequelize,
        freezeTableName: true
    });
