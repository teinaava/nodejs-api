import { init } from './db/db.js';
import express from 'express';
import usersRouter from './Routes/UsersRoute.js';
import topicsRouter from './Routes/BoardsRoute.js';
import passport from 'passport';
import { passInit } from './jwt/passport.js';
import boardsRouter from './Routes/BoardsRoute.js';
import { messagesRouter } from './Routes/MessagesRoute.js';
import swaggerJsdoc from 'swagger-jsdoc';
import SwaggerUi from 'swagger-ui-express';

const server = express();
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Learn API',
            version: '1.0.0',
            description: ''
        }
    },
    apis: ['./Routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

const PORT = 1337;
const jsonParser = express.json();
// server goes run here
init().then(() => {
    server.listen(PORT, () => {
        console.log(`SERVER IS RUNNING ON ${PORT}`)
    })
});
server.use(passport.initialize());
passInit(passport);
server.use(jsonParser);
server.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));
//routers
server.use('/users', usersRouter);
server.use('/topics', topicsRouter);
server.use('/boards', boardsRouter);
server.use('/messages', messagesRouter);
server.get('/', (req, res) => {
    res.json({
        message: 'HENLO! IT\'\S API. I think you should try another one path to get something... more useful, u know'
    });
});



