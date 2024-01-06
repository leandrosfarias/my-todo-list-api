// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Verifique se o token é válido
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, 'meu_segredo');

        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
}
