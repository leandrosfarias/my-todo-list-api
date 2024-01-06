import { QueryResult } from 'pg';
import * as db from '../Database/Database';

export class TodoListController {

    async createTable() {
        const rowsCount: number | null = (await db.query(`
        CREATE TABLE todo_lists (
            id SERIAL PRIMARY KEY,
            name varchar(50),
            user_id INT REFERENCES users(id)
        );
        `) as QueryResult).rowCount;
        return rowsCount;
    }
}