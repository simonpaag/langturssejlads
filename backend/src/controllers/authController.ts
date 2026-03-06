import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';

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

        // Generate JWT for auto-login
        const token = jwt.sign(
            { userId: newUser.id, isSystemAdmin: newUser.isSystemAdmin },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });
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

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                crewMemberships: {
                    include: {
                        boat: true
                    }
                },
                subscriptions: {
                    include: {
                        boat: true
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // don't send back passwordHash
        const { passwordHash, ...userWithoutPassword } = user;

        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateInterests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { interests } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!Array.isArray(interests)) {
            res.status(400).json({ error: 'Interests must be an array of strings' });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { interests },
        });

        res.status(200).json({
            message: 'Interests updated successfully',
            interests: updatedUser.interests
        });
    } catch (error) {
        console.error('Update interests error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, profileImage } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (profileImage !== undefined) dataToUpdate.profileImage = profileImage;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        });

        // Fjern password-hashet før the returneres
        const { passwordHash, ...userWithoutPassword } = updatedUser;

        res.status(200).json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { wantsNewsletter, boatIds } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Use a transaction to update the user and replace subscriptions
        await prisma.$transaction(async (tx) => {
            // Update newsletter preference
            if (typeof wantsNewsletter === 'boolean') {
                await tx.user.update({
                    where: { id: userId },
                    data: { wantsNewsletter }
                });
            }

            // If boatIds are provided, replace existing subscriptions
            if (Array.isArray(boatIds)) {
                // Delete existing ones
                await tx.notificationSubscription.deleteMany({
                    where: { userId }
                });

                // Create new ones
                if (boatIds.length > 0) {
                    await tx.notificationSubscription.createMany({
                        data: boatIds.map((boatId: number) => ({
                            userId,
                            boatId
                        }))
                    });
                }
            }
        });

        // Refetch user to return updated state
        const updatedUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscriptions: {
                    include: { boat: true }
                }
            }
        });

        res.status(200).json({
            message: 'Notifikationsindstillinger opdateret',
            wantsNewsletter: updatedUser?.wantsNewsletter,
            subscriptions: updatedUser?.subscriptions
        });
    } catch (error) {
        console.error('Update notifications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
