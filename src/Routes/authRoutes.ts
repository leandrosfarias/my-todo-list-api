// routes/authRoutes.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', (req, res) => {
    // Verifique as credenciais do usuário no banco de dados
    const { username, password } = req.body;

    // Exemplo simplificado de verificação de usuário
    if (username === 'usuario' && password === 'senha') {
        const token = jwt.sign({ username }, 'seu_segredo_jwt', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

export default router;
