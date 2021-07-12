import http from 'http';
import * as env from 'dotenv';
import { app }  from './index';

declare const process : {
    env : {
        SERVER_PORT: number,
        SERVER_HOST: string
    }
};
const httpServer = http.createServer(app);

env.config();

httpServer.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Server started at ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});