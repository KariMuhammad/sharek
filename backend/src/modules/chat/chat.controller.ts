import { Request, Response } from 'express';
import prisma from '../../config/database';
import { CustomError } from '../../middleware/errorHandler';

export const chatController = {
  getMessages: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const userId = (req as any).user.id;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Check if user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new CustomError('Not authorized to view project chat', 403);
    }

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.chatMessage.count({
        where: { projectId },
      }),
    ]);

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Show oldest first
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  },

  sendMessage: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const userId = (req as any).user.id;
    const { content, isCommand = false } = req.body;

    // Check if user is a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new CustomError('Not authorized to send messages to this project', 403);
    }

    // Only authors can send command messages
    if (isCommand && membership.role !== 'AUTHOR') {
      throw new CustomError('Only project authors can send command messages', 403);
    }

    const message = await prisma.chatMessage.create({
      data: {
        projectId,
        userId,
        content,
        isCommand,
      },
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

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message },
    });
  },

  deleteMessage: async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.params;
    if (!messageId) {
      throw new Error("Missing messageId");
    }

    const userId = (req as any).user.id;

    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: {
        project: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!message) {
      throw new CustomError('Message not found', 404);
    }

    // Check if user is the message author or project author
    const isAuthor = message.userId === userId;
    const isProjectAuthor = message.project.members.some(member => member.role === 'AUTHOR');

    if (!isAuthor && !isProjectAuthor) {
      throw new CustomError('Not authorized to delete this message', 403);
    }

    await prisma.chatMessage.delete({
      where: { id: messageId },
    });

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  },
};
