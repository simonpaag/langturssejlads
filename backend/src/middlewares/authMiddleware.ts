import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-later';

// Extend Express Request type to include user information
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        isSystemAdmin: boolean;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET) as { userId: number; isSystemAdmin: boolean };
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET) as { userId: number; isSystemAdmin: boolean };
        req.user = verified;
    } catch (err) {
        // Ignorer fejl - brugeren optræder blot som logget ud
    }
    next();
};
