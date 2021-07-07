import express, {Application} from 'express';
import {productsRouter} from './routes/products.routes';
import * as env from 'dotenv';

declare const process : {
    env : {
        SERVER_PORT: number,
        SERVER_HOST: string
    }
};

const app: Application = express();

app.use(
    '/api',
    productsRouter
);



app.listen(process.env.SERVER_PORT || 3005, process.env.SERVER_HOST, () => {
    env.config();
    console.log(`Server started ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}\r\n`);
});