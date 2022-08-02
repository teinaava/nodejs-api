import express from 'express';
import { Users } from '../db/Users.js';
import Sequelize from 'sequelize';
import { getOffestAndTotalPages } from '../utils.js';
import { auth } from '../auth.js';
const Op = Sequelize.Op;

const usersRouter = express.Router();
export default usersRouter;
//GET ALL USERS
usersRouter.get('/', async (req, res) => {
    let total = await Users.count();
    try {
        if (req.query.limit && req.query.page) {
            let { totalPages, offest } = getOffestAndTotalPages(req.query.page, req.query.limit, total);
            let { rows, count } = await Users.findAndCountAll({
                limit: req.query.limit,
                offset: offest,
                attributes: {
                    exclude: ['password', 'updatedAt']
                },
            });
            res.json({
                totalPages: totalPages,
                totalUsers: total,
                resultCount: count,
                page: req.query.page,
                limit: req.query.limit,
                users: rows
            });
        } else {
            let { rows, count } = await Users.findAndCountAll({
                attributes: {
                    exclude: ['password', 'updatedAt']
                }
            });
            res.json({
                totalUsers: total,
                resultCount: count,
                users: rows
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});

//GET USER BY ID
usersRouter.get('/:id', async (req, res) => {
    try {
        const user = await Users.findOne({
            where: { id: req.params.id },
            attributes: {
                exclude: ['password', 'updatedAt']
            }
        });
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' })
    }
});

//CREATE NEW USER
usersRouter.post('/create', async (req, res) => {
    try {
        if (req.body.name && req.body.password && req.body.login) {
            const user = req.body;
            const record = await Users.create(user);
            res.json(record);
        }
        else {
            res.status(400).json({ message: 'Invalid data', request: req.body });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});

//REMOVE USER BY ID
usersRouter.delete('/delete/:id', async (req, res) => {
    try {
        const user = await Users.findOne({ where: { id: req.params.id } })
        const count = await Users.destroy({
            where: { id: req.params.id }
        });
        if (count === 0)
            res.status(404).json({ message: `Error 404 User with id equlas ${req.params.id} does not exist`, })
        else
            res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});

//FIND USER BY NAME
usersRouter.get('/search/:value', async (req, res) => {
    try {
        const result = await Users.findAll({
            where: {
                name: { [Op.like]: `%${req.params.value}%` }
            },
            attributes: {
                exclude: ['password', 'updatedAt']
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});
usersRouter.put('/edit', async (req, res) => {
    try {
        let user = req.body.user;
        await Users.update(user, {
            where: { id: user.id }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' })
    }
})
usersRouter.post('/login', async (req, res) => {
    auth(req, res);
})

