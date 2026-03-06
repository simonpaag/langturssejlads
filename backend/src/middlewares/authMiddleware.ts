import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

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

export const authorizeSystemAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.isSystemAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. System Admin role required.' });
    }
};

export const requireActiveUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { isBlocked: true }
        });

        if (!user || user.isBlocked) {
            res.status(403).json({ error: 'Forbidden. Brugerkontoen er blokeret.' });
            return;
        }

        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error while checking user status.' });
    }
};
