import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { CustomError } from '../middleware/errorHandler';

export const validateProjectAccess = async (
    projectId: string,
    userId: string,
    requiredRole?: 'AUTHOR' | 'CONTRIBUTOR' | 'ADMIN'
): Promise<boolean> => {
    const membership = await prisma.projectMember.findUnique({
        where: {
            projectId_userId: {
                projectId,
                userId,
            },
        },
    });

    if (!membership) {
        return false;
    }

    if (requiredRole) {
        return membership.role === requiredRole;
    }

    return true;
};

export const validateProjectOwnership = async (
    projectId: string,
    userId: string
): Promise<boolean> => {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    return project?.authorId === userId;
};

export const getProjectMembers = async (projectId: string) => {
    return prisma.projectMember.findMany({
        where: { projectId },
        include: {
            user: {
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
};

export const addProjectMember = async (
    projectId: string,
    userId: string,
    role: 'AUTHOR' | 'CONTRIBUTOR' | 'ADMIN' = 'CONTRIBUTOR'
): Promise<void> => {
    await prisma.projectMember.create({
        data: {
            projectId,
            userId,
            role,
        },
    });
};

export const removeProjectMember = async (
    projectId: string,
    userId: string
): Promise<void> => {
    await prisma.projectMember.delete({
        where: {
            projectId_userId: {
                projectId,
                userId,
            },
        },
    });
};
