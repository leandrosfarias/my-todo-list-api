import express from "express";
import { Request, Response } from "express";
import { UserController } from "../Controllers/UserController";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/table", async (req: Request, res: Response) => {
    const result = await userController.createTable();
    if (result) res.status(200).send("Tabela 'users' criado com sucesso");
    else res.status(500).send("Erro na criação da tabela 'users'");
});

userRouter.post("/", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res
            .status(400)
            .send(
                "Os campos obrigatórios 'usuário', 'e-mail' e 'senha' não foram fornecidos ou são inválidos."
            );
        return;
    }
    const result = await userController.createUser(name, email, password);
    console.log(result);
    if (result) {
        return res.status(200).json(result);
    }
    return res
        .status(500)
        .send("Algo errado ocorreu durante criação do usuário.");
});

userRouter.get("/", async (req: Request, res: Response) => {
    const result = res.status(200).json(await userController.getUsers());
    console.log('result -> ', result);
    return result;
});

userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const resultLogin = await userController.performLogin(email, password);

    if (resultLogin) {
        const token = jwt.sign({ email, userId: resultLogin.id }, "meu_segredo", {
            expiresIn: "1h",
        });
        res.status(200).json({
            message: "Login realizado com sucesso",
            token,
        });
    } else res.status(400).send("Email ou senha inválidos");
});

userRouter.post(
    "/todoList",
    verifyToken,
    async (req: Request, res: Response) => {
        const userInfo = (req as any).user;

        console.log(userInfo.userId);
        const userId = Number.parseInt(userInfo.userId);
        const { todoListName } = req.body;
        const result = await userController.createTodoList(userId, todoListName);
        if (result instanceof String) {
            return res.status(201).json({
                message: "Lista de tarefas criado com sucesso.",
                todoListName: result,
            });
        } else if (result instanceof Object) {
            return res.status(200).json(result);
        } else {
            res
                .status(500)
                .send("Algo errado ocorreu durante a criação de lista de tarefas");
            return;
        }
    }
);

userRouter.get(
    "/todoLists",
    verifyToken,
    async (req: Request, res: Response) => {
        const userId = (req as any).user.userId;
        const result = await userController.getTodoLists(userId);
        return res.status(200).json(result);
    }
);

userRouter.post("/todo", verifyToken, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { todoListName, todoName } = req.body;
    const result = await userController.createTodo(
        userId,
        todoListName,
        todoName
    );
    return res.status(200).json({ created: result });
});

userRouter.get("/todos/:todoListId", verifyToken, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { todoListId } = req.params;
    console.log("todoListId -> ", todoListId);
    const result = await userController.getTodosByUserAndTodoListId(
        userId,
        Number.parseInt(todoListId)
    );
    if (result instanceof Error) {
        return res.status(500).send("Algo deu errado");
    } else {
        return res.status(200).json(result);
    }
});

export default userRouter;
