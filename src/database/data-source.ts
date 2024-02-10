import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config())

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    entities: ['dist/**/*.entity.js'],
    synchronize: process.env.MODE === 'production' ? false : true,
    migrations: ['dist/database/migrations/*.js'],
})