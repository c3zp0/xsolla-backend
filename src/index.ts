import express, {Application, NextFunction, Request, Response} from 'express';
import {productsRouter} from './routes/products.routes';
import * as env from 'dotenv';
import http from 'http';

declare const process : {
    env : {
        SERVER_PORT: number,
        SERVER_HOST: string
    }
};

const app: Application = express();
const httpServer = http.createServer(app);

app.use('/', (request: Request, response: Response, next: NextFunction) => {
    console.log('Request');
    next();
})

app.use(
    '/api',
    productsRouter
);



httpServer.listen(3001, () => {
    env.config();
    console.log(`Server started`);
    // console.log(process.env);
    // console.log(`Server started ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}\r\n`);
});