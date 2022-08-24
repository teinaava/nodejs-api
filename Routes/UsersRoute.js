import express, { json } from 'express';
import { Users } from '../db/Users.js';
const usersRouter = express.Router();
export default usersRouter;
/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         type: number
 *       - in: query
 *         name: page
 *         required: false
 *         type: number
 *       - in: query
 *         name: search
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Returns an array of users.
 *     tags:
 *      - Users
 *     
 */
usersRouter.get('/', async (req, res) => {
    try {
        let { result, code } = await Users.getAllUsersAsync(req.query.limit,
            req.query.page, req.query.search);
        res.status(code).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get board by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         type: number
 *     responses:
 *       200:
 *         description: Returns an user
 *       404:
 *         description: user not found
 *     tags:
 *      - Users
 *     
 */
usersRouter.get('/:id', async (req, res) => {
    try {
        const { rows, count } = await Users.findAndCountAll({
            where: { id: req.params.id },
            attributes: {
                exclude: ['password', 'updatedAt']
            }
        });
        if (count > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({
                message: 'user not found'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' })
    }
});

/**
 * @openapi
 * /users/create:
 *   post:
 *     summary: create a new user
 *     parameters:
 *       - name: body
 *         in: body
 *         required:
 *            - name
 *            - login
 *            - password
 *         properties:
 *             name:
 *               type: string
 *             login:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: Created board.
 *       400: 
 *        description: Returns a message 'Invalid data'.
 *     tags:
 *      - Users
 */
usersRouter.post('/create', async (req, res) => {
    try {
        let { result, code } = await Users.createUserAsync(req.body.name,
            req.body.login, req.body.password);
        res.status(code).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});

/**
 * @openapi
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: number
 *     responses:
 *       204:
 *         description: user has been deleted.
 *       404:
 *        description: user not found.
 *     tags:
 *      - Users
 */
usersRouter.delete('/delete/:id', async (req, res) => {
    try {
        let { code, result } = await Users.deleteUserAsync(req.params.id);
        res.status(code).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});
/**
 * @openapi
 * /users/edit/{id}:
 *   put:
 *     summary: Edit user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *       - name: body
 *         in: body
 *         required:
 *            - name
 *            - login
 *         properties:
 *             name:
 *               type: string
 *             login:
 *               type: string
 *     responses:
 *       200:
 *         description: user updated
 *       404:
 *         description: user not found
 *     tags:
 *       - Users
 */
usersRouter.put('/edit/:id', async (req, res) => {
    try {
        let { result, code } = await Users.editUserAsync(req.params.id, req.body);
        res.status(code).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' })
    }
});
/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Edit user
 *     parameters:
 *       - name: body
 *         in: body
 *         required:
 *            - login
 *            - password
 *         properties:
 *             login:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: login
 *       401:
 *         description: Unauthorized
 *     tags:
 *       - Users
 */
usersRouter.post('/login', async (req, res) => {
    try {
        let { result, code } = await Users.auth(req.body.login, req.body.password);
        res.status(code).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' })
    }
})

