import { comparePasswords, hashPassword } from "../utils";
import * as db from "../Database/Database";
import { Query, QueryResult } from "pg";
import IUser from "../Models/User";
import { ITodo, ITodoList } from "../Models/Todo";
import { query } from "express";

export class UserController {
    async createTable() {
        const query = `
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL, 
            email VARCHAR(255) NOT NULL, 
            password VARCHAR(255) NOT NULL
        );
        `;
        return await db.query(query);
    }

    async createUser(
        name: string,
        email: string,
        password: string
    ): Promise<{ message: string; result: number } | { message: string }> {
        const userExist: boolean = await this.verirfyUserExist(email);

        if (userExist) return { message: "Email já cadastrado" };
        else {
            const queryResult = {
                message: "Usuário criado com sucesso",
                result: (await db.query(
                    `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3) RETURNING id;
        `,
                    [name, email, await hashPassword(password)]
                )) as number[][0],
            };
            return queryResult;
        }
    }

    async verirfyUserExist(email: string): Promise<boolean> {
        const queryResult = (await db.query(
            `SELECT name, email FROM users
         WHERE email = $1;`,
            [email]
        )) as any[];
        return queryResult.length > 0;
    }

    async getUsers() {
        return (
            (await db.query<IUser>(`
            SELECT id, name, done, todo_list_id, user_id
            FROM public.todos;
        `)) as QueryResult
        ).rows;
    }

    async performLogin(
        email: string,
        password: string
    ): Promise<{ id: number; sucess: boolean } | undefined> {
        const queryResult = (
            (await db.query(
                `
        SELECT id, email, password FROM users
        WHERE email = $1
        ;
        `,
                [email]
            )) as any[]
        )[0];

        if (queryResult) {
            if (!queryResult!.email || !queryResult!.password) return undefined;

            if (await comparePasswords(password, queryResult!.password)) {
                return { id: queryResult.id, sucess: true };
            } else return { id: queryResult.id, sucess: false };
        }
    }

    async createTodoList(userId: number, todoListName: string): Promise<{ id: number, name: string } | { message: string }> {
        const todoListNameExist = await this.verifyTodoListNameExist(
            userId,
            todoListName
        );
        console.log("todoListNameExist -> \n", todoListNameExist);
        if (todoListNameExist) return { message: "Lista já existe" };

        const queryResult = (await db.query(
            `
        INSERT INTO todo_lists (user_id, name)
        VALUES ($1, $2) RETURNING id, name;
        `,
            [userId, todoListName]
        )) as any[];
        console.log("queryResult -> \n", queryResult);
        return queryResult[0] as { id: number, name: string };
    }

    async getTodoLists(userId: number): Promise<ITodoList[] | unknown> {
        return await db.query<ITodoList>(
            `SELECT id, name FROM todo_lists 
        WHERE user_id = $1`,
            [userId]
        ) as ITodoList[];
    }

    async createTodo(userId: number, todoListName: string, todoName: string) {
        console.log(todoName);
        const todoListNameExist = await this.verifyTodoListNameExist(
            userId,
            todoListName
        );
        if (todoListNameExist) {
            console.log("vou executar query");
            const todoListId = (
                (await db.query<string>(
                    `
                SELECT id FROM todo_lists WHERE name = $1;
            `,
                    [todoListName]
                )) as any[]
            )[0];
            console.log("todoListId -> ", todoListId.id);

            const queryResult = (await db.query(
                `
            INSERT INTO todos (name, todo_list_id, user_id)
            VALUES ($1, $2, $3) RETURNING name;
            `,
                [todoName, todoListId.id, userId]
            )) as any[];
            console.log(queryResult);
            if (queryResult) {
                return queryResult[0];
            }
        }
        return false;
    }

    async getTodosByUserAndTodoListId(
        userId: number,
        todoListName: number
    ): Promise<ITodo[] | Error> {
        try {
            const result = (await db.query(
                `
            SELECT id, name, done FROM todos
            WHERE user_id = $1 AND todo_list_id = $2;
            `,
                [userId, todoListName]
            )) as ITodo[];
            console.log("result -> ", result);
            return result;
        } catch (error) {
            console.log("error -> ", error);
            return new Error("Algo deu errado");
        }
    }

    private async verifyTodoListNameExist(
        userId: number,
        todoListName: string
    ): Promise<boolean | undefined> {
        console.log("fui chamado com id de usuário ->", userId);
        try {
            const todoListNameExist = (await db.query(
                `
        SELECT name FROM todo_lists WHERE name = $1 AND user_id = $2;
        `,
                [todoListName, userId]
            )) as any[];

            if (todoListNameExist.length > 0) return true;
            return false;
        } catch (error) {
            console.log("error -> ", error);
            return undefined;
        }
    }
}
