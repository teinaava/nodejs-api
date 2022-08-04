import express from 'express';
import { Boards } from "../db/Boards.js";
const boardsRouter = express.Router();
export default boardsRouter;

// GET ALL TOPICS

/**
 * @openapi
 * /boards:
 *   get:
 *     summary: Get all boards
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
 *         description: Returns an array of boards.
 *     tags:
 *      - Boards
 *     
 */
boardsRouter.get('/', async (req, res) => {
    try {
        let boards = await Boards.GetBoardsAsync(req.query.limit, req.query.page, req.query.search);
        res.json(boards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});
/**
 * @openapi
 * /boards/{id}:
 *   get:
 *     summary: Get board by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Returns a board.
 *       404:
 *        description: Returns a message 'board not found'.
 *     tags:
 *      - Boards
 */

boardsRouter.get('/:id', async (req, res) => {
    try {
        let board = await Boards.findOne({ where: { id: req.params.id } });
        if (!board)
            res.status(404).json({
                message: 'board not found'
            });
        else
            res.json(board);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});
/**
 * @openapi
 * /boards/create:
 *   post:
 *     summary: create a new board
 *     parameters:
 *       - name: body
 *         in: body
 *         required:
 *            - name
 *            - description
 *         properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       201:
 *         description: Created board.
 *       404:
 *        description: Returns a message 'board not found'.
 *       400: 
 *        description: Returns a message 'incorrect name'.
 *     tags:
 *      - Boards
 */


boardsRouter.post('/create', async (req, res) => {
    try {
        if (req.body.name) {
            let { result, code } = await Boards.createBoardAsync(req.body.name, req.body.description);
            res.status(code).json(result);
        }
        else
            res.status(400).json({
                message: 'incorrect name'
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});

