import { Request, Response } from 'express';
import prisma from '../../config/database';
import { CustomError } from '../../middleware/errorHandler';
// import transporter from '../../config/email';

export const projectController = {
  getAllProjects: async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, status, technologies, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { purpose: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (technologies) {
      const techArray = Array.isArray(technologies) ? technologies : [technologies];
      where.technologies = {
        hasSome: techArray,
      };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          members: {
            select: {
              id: true,
              userId: true,
              role: true,
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
      prisma.project.count({ where }),
    ]);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  },

  searchProjects: async (req: Request, res: Response): Promise<void> => {
    const { q, page = 1, limit = 10, status, technologies } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
        { purpose: { contains: q as string, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (technologies) {
      const techArray = Array.isArray(technologies) ? technologies : [technologies];
      where.technologies = {
        hasSome: techArray,
      };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
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
      prisma.project.count({ where }),
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

  getTrendingProjects: async (req: Request, res: Response): Promise<void> => {
    const { limit = 10 } = req.query;

    // Get projects with most contributions and members
    const projects = await prisma.project.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            contributions: true,
            members: true,
          },
        },
      },
      orderBy: [
        { contributions: { _count: 'desc' } },
        { members: { _count: 'desc' } },
        { createdAt: 'desc' },
      ],
      take: Number(limit),
    });

    res.json({
      success: true,
      data: { projects },
    });
  },

  getProject: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            skills: true,
          },
        },
        members: {
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
        },
        attachments: true,
        _count: {
          select: {
            contributions: true,
            members: true,
          },
        },
      },
    });

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    res.json({
      success: true,
      data: project,
    });
  },

  createProject: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
    const { title, description, purpose, technologies, tasks, githubLink, price } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        purpose,
        technologies,
        tasks,
        githubLink,
        price,
        authorId: userId,
      },
      include: {
        author: {
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
      message: 'Project created successfully',
      data: { project },
    });
  },

  updateProject: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const userId = (req as any).user.id;
    const updateData = req.body;

    // Check if user is the author
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    if (project.authorId !== userId) {
      throw new CustomError('Not authorized to update this project', 403);
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        author: {
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
      message: 'Project updated successfully',
      data: { project: updatedProject },
    });
  },

  deleteProject: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const userId = (req as any).user.id;

    // Check if user is the author
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    if (project.authorId !== userId) {
      throw new CustomError('Not authorized to delete this project', 403);
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  },

  uploadFile: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }


    const userId = (req as any).user.id;
    const file = req.file;

    if (!file) {
      throw new CustomError('No file uploaded', 400);
    }

    // Check if user is the author
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    if (project.authorId !== userId) {
      throw new CustomError('Not authorized to upload files to this project', 403);
    }

    const attachment = await prisma.attachment.create({
      data: {
        projectId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: { attachment },
    });
  },

  getProjectMembers: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            skills: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    res.json({
      success: true,
      data: { members },
    });
  },

  getChatMessages: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

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
};
