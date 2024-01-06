import { TodoList } from "./TodoList";

export default interface IUser {
    id?: number;
    name: string;
    email: string;
    password: string;
    todoList?: TodoList;
}