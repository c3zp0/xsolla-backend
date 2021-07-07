import {Pool} from 'pg';

declare const process: {
    env: {
        PGUSER: string,
        PGHOST: string,
        PGPASSWORD: string,
        PGDATABASE: string,
        PGPORT: number
    }
};

export const dbClient = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});