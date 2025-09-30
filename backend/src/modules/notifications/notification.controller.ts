import { Request, Response } from 'express';
import prisma from '../../config/database';
import { CustomError } from '../../middleware/errorHandler';

export const notificationController = {
    getNotifications: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const where: any = { userId };

        if (unreadOnly === 'true') {
            where.isRead = false;
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma.notification.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                notifications,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    },

    getUnreadCount: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;

        const unreadCount = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        res.json({
            success: true,
            data: { unreadCount },
        });
    },

    createNotification: async (req: Request, res: Response): Promise<void> => {
        const { userId, type, title, message, data } = req.body;

        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                data,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: { notification },
        });
    },

    markAsRead: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;
        const { notificationId } = req.params;
        if (!notificationId) {
            throw new Error("Missing notificationId")
        }

        await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: { isRead: true },
        });

        res.json({
            success: true,
            message: 'Notification marked as read',
        });
    },

    markAllAsRead: async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;

        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: { isRead: true },
        });

        res.json({
            success: true,
            message: 'All notifications marked as read',
        });
    },

    deleteNotification: async (req: Request, res: Response): Promise<void> => {
        const { notificationId } = req.params;
        if (!notificationId) {
            throw new Error("Missing notificationId")
        }

        const userId = (req as any).user.id;

        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new CustomError('Notification not found', 404);
        }

        if (notification.userId !== userId) {
            throw new CustomError('Not authorized to delete this notification', 403);
        }

        await prisma.notification.delete({
            where: { id: notificationId },
        });

        res.json({
            success: true,
            message: 'Notification deleted successfully',
        });
    },
};
