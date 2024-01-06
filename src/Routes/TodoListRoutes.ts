const express = require('express');
import { Request, Response } from 'express';
import { ITodo } from '../Models/Todo';
import { TodoListController } from '../Controllers/TodoListController';

const todoListRouter = express.Router();
const todoListController = new TodoListController();
const todoList: ITodo[] = [];

todoListRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 'messagem': 'Minha lista de tarefas' });
})

todoListRouter.get('/table', async (req: Request, res: Response) => {
    const result = await todoListController.createTable()
    if (result)
        res.status(200).json({ 'messagem': 'Criado' });
    else
        res.status(400).json({ 'messagem': 'Não Criado' });
})

todoListRouter.post('/', (req: Request, res: Response) => {
    const { name } = req.body;
})

export default todoListRouter;