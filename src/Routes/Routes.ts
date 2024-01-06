const express = require('express');
import todoListRouter from "./TodoListRoutes";
import userRouter from "./UserRoutes";

const router = express.Router();

const todoListRoutes = todoListRouter;
const userRoutes = userRouter;

router.use('/todoList', todoListRoutes);
router.use('/user', userRoutes);

export default router;