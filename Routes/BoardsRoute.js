import express from 'express';
import { Boards } from "../db/Boards.js";
const boardsRouter = express.Router();
export default boardsRouter;

// GET ALL TOPICS
boardsRouter.get('/', async (req, res) => {
    try {
        let boards = await Boards.GetBoardsAsync(req.query.limit, req.query.page, req.query.search);
        res.json(boards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});
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

