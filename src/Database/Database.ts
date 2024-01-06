import { Pool, QueryResult } from 'pg'

interface IQueryResult<T> {
    rows: T[];
    rowCount: number;
}


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todolistdb',
    password: '1234',
    port: 5432
})



export const query = async <T>(query: string, params?: any[]): Promise<any[] | unknown> => {
    try {
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        return error;
    }
}
