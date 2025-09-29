import { Request, Response } from 'express';
import prisma from '../../config/database';
import { CustomError } from '../../middleware/errorHandler';

export const userController = {
  getProfile: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        skills: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  },

  updateProfile: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    const { firstName, lastName, bio } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        bio,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        skills: true,
        avatar: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  },

  updateSkills: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    const { skills } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { skills },
      select: {
        id: true,
        skills: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Skills updated successfully',
      data: { user },
    });
  },

  getUserProfile: async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("Missing userId");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        skills: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  },

  getUserProjects: async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new Error("Missing userId");
    }

    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { authorId: userId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              contributions: true,
              members: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.project.count({
        where: { authorId: userId },
      }),
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  },

  getUserContributions: async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("Missing userId");
    }

    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [contributions, total] = await Promise.all([
      prisma.contribution.findMany({
        where: { userId },
        include: {
          project: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.contribution.count({
        where: { userId },
      }),
    ]);

    res.json({
      success: true,
      data: {
        contributions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  },

  getUserRatings: async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("Missing userId");
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
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  },
};
