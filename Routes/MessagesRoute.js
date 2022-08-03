import { Messages } from "../db/Messages.js";
import exporess from 'express';


export const messagesRouter = exporess.Router();



messagesRouter.post('/create', async (req, res) => {
    try {
        let { result, code } = await Messages.createMessageAsync(req.body.body,
            req.body.boardId,
            req.body.userId);
        res.status(code).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});
messagesRouter.get('/:board', async (req, res) => {

    try {
        let {result, code} = await Messages.getMessagesByBoardIdAsync(req.params.board,
             req.query.page, req.query.limit, req.query.searchQuery);
        res.status(code).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});
