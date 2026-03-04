import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-later';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });

        res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, isSystemAdmin: user.isSystemAdmin },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, isSystemAdmin: user.isSystemAdmin } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
