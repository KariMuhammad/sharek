import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { CustomError } from '../middleware/errorHandler';

export const createNotification = async (
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
): Promise<void> => {
    try {
        await prisma.notification.create({
            data: {
                userId,
                type: type as any,
                title,
                message,
                data,
            },
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};

export const sendProjectNotification = async (
    projectId: string,
    type: string,
    title: string,
    message: string,
    excludeUserId?: string
): Promise<void> => {
    try {
        const members = await prisma.projectMember.findMany({
            where: {
                projectId,
                ...(excludeUserId && { userId: { not: excludeUserId } }),
            },
            select: { userId: true },
        });

        const notifications = members.map(member => ({
            userId: member.userId,
            type: type as any,
            title,
            message,
            data: { projectId },
        }));

        await prisma.notification.createMany({
            data: notifications,
        });
    } catch (error) {
        console.error('Failed to send project notification:', error);
    }
};

export const cleanupOldNotifications = async (): Promise<void> => {
    try {
        // Delete notifications older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyDaysAgo,
                },
            },
        });
    } catch (error) {
        console.error('Failed to cleanup old notifications:', error);
    }
};
