import { Messages } from "../db/Messages.js";
import exporess from 'express';


export const messagesRouter = exporess.Router();


/**
 * @openapi
 * /messages/create:
 *   post:
 *     summary: Create a new message
 *     parameters:
 *       - name: body
 *         in: body
 *         required:
 *            - body
 *            - boardId
 *            - userId
 *         properties:
 *             body:
 *               type: string
 *             boardId:
 *               type: number
 *             userId:
 *               type: number
 *     responses:
 *       201:
 *         description: Created message.
 *       404:
 *        description: Not found board or user
 *       400: 
 *        description: Incorrect data
 *     tags:
 *      - Messages
 */
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

/**
 * @openapi
 * /messages/{boardId}:
 *   get:
 *     summary: Get message by board ID
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         type: number
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
 *      
 *     responses:
 *       200:
 *         description: Returns messages.
 *     tags:
 *      - Messages
 *     
 */
messagesRouter.get('/:boardId', async (req, res) => {

    try {
        let { result, code } = await Messages.getMessagesByBoardIdAsync(req.params.boardId,
            req.query.page, req.query.limit, req.query.searchQuery);
        res.status(code).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});

/**
 * @openapi
 * /messages/delete/{id}:
 *   delete:
 *     summary: Delete message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: number
 *     responses:
 *       204:
 *         description: message has been deleted.
 *       404:
 *        description: message not found.
 *     tags:
 *      - Messages
 */


messagesRouter.delete('/delete/:id', async (req, res) => {
    try {
        let { result, code } = await Messages.deleteMessageAsync(req.params.id);
        res.status(code).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'something went wrong 500 Internal Server Error' });
    }
});