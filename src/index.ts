import express, {Application, NextFunction, Request, Response} from 'express';
import {productsRouter} from './routes/products.routes';

export const app: Application = express();

app.use(express.json({limit: '1mb'}));

app.use('/', (request: Request, response: Response, next: NextFunction) => {
    console.log(`Request - ${request.url}`);
    next();
})

app.use(
    '/api',
    productsRouter
);





