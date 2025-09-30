import { Request, Response } from 'express';
import prisma from '../../config/database';
import { CustomError } from '../../middleware/errorHandler';

export const ratingController = {
    createRating: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;
        const { receiverId, projectId, rating, comment } = req.body;

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new CustomError('Rating must be between 1 and 5', 400);
        }

        // Check if user is trying to rate themselves
        if (userId === receiverId) {
            throw new CustomError('Cannot rate yourself', 400);
        }

        // Check if rating already exists for this combination
        const existingRating = await prisma.rating.findUnique({
            where: {
                senderId_receiverId_projectId: {
                    senderId: userId,
                    receiverId,
                    projectId: projectId || null,
                },
            },
        });

        if (existingRating) {
            throw new CustomError('Rating already exists for this user and project', 400);
        }

        // Verify that the users have collaborated on the project (if projectId is provided)
        if (projectId) {
            const collaboration = await prisma.projectMember.findFirst({
                where: {
                    projectId,
                    OR: [
                        { userId, role: 'AUTHOR' },
                        { userId: receiverId, role: 'CONTRIBUTOR' },
                    ],
                },
            });

            if (!collaboration) {
                throw new CustomError('Cannot rate users who have not collaborated on this project', 400);
            }
        }

        const newRating = await prisma.rating.create({
            data: {
                senderId: userId,
                receiverId,
                projectId: projectId || null,
                rating,
                comment,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: 'Rating created successfully',
            data: { rating: newRating },
        });
    },

    getUserRatings: async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.params;
        if (!userId) {
            throw new Error("Missing userId")
        }

        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const [ratings, total] = await Promise.all([
            prisma.rating.findMany({
                where: { receiverId: userId },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma.rating.count({
                where: { receiverId: userId },
            }),
        ]);

        // Calculate average rating
        const avgRating = await prisma.rating.aggregate({
            where: { receiverId: userId },
            _avg: { rating: true },
        });

        res.json({
            success: true,
            data: {
                ratings,
                averageRating: avgRating._avg.rating || 0,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                },
            },
        });
    },

    updateRating: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;
        const { ratingId } = req.params;
        if (!ratingId) {
            throw new Error("Missing ratingId")
        }

        const { rating, comment } = req.body;

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new CustomError('Rating must be between 1 and 5', 400);
        }

        const existingRating = await prisma.rating.findUnique({
            where: { id: ratingId },
        });

        if (!existingRating) {
            throw new CustomError('Rating not found', 404);
        }

        if (existingRating.senderId !== userId) {
            throw new CustomError('Not authorized to update this rating', 403);
        }

        const updatedRating = await prisma.rating.update({
            where: { id: ratingId },
            data: { rating, comment },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            message: 'Rating updated successfully',
            data: { rating: updatedRating },
        });
    },

    deleteRating: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;
        const { ratingId } = req.params;
        if (!ratingId) {
            throw new Error("Missing ratingId")
        }

        const rating = await prisma.rating.findUnique({
            where: { id: ratingId },
        });

        if (!rating) {
            throw new CustomError('Rating not found', 404);
        }

        if (rating.senderId !== userId) {
            throw new CustomError('Not authorized to delete this rating', 403);
        }

        await prisma.rating.delete({
            where: { id: ratingId },
        });

        res.json({
            success: true,
            message: 'Rating deleted successfully',
        });
    },

    getMyRatings: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const [ratings, total] = await Promise.all([
            prisma.rating.findMany({
                where: { senderId: userId },
                include: {
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma.rating.count({
                where: { senderId: userId },
            }),
        ]);

        res.json({
            success: true,
            data: {
                ratings,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                },
            },
        });
    },
};
