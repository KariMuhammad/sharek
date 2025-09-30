import { Request, Response } from 'express';
import prisma from '../../config/database';
import { CustomError } from '../../middleware/errorHandler';
import transporter from '../../config/email';

export const contributionController = {
  requestContribution: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.body;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const userId = (req as any).user.id;
    const { message } = req.body;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        author: true,
      },
    });

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Check if user is not the author
    if (project.authorId === userId) {
      throw new CustomError('Cannot request to contribute to your own project', 400);
    }

    // Check if contribution request already exists
    const existingContribution = await prisma.contribution.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingContribution) {
      throw new CustomError('Contribution request already exists', 400);
    }

    // Create contribution request
    const contribution = await prisma.contribution.create({
      data: {
        projectId,
        userId,
        message,
        status: 'PENDING',
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
        project: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Send notification email to project author
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: project.author.email,
      subject: `New Contribution Request for "${project.title}"`,
      html: `
        <h2>New Contribution Request</h2>
        <p>You have received a new contribution request for your project "${project.title}".</p>
        <p><strong>Contributor:</strong> ${contribution.user.username}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p>Please log in to your account to review and respond to this request.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Contribution request sent successfully',
      data: { contribution },
    });
  },

  getMyRequests: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.id;
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
                  avatar: true,
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

  getProjectContributions: async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Missing projectId");
    }

    const userId = (req as any).user.id;

    // Check if user is the project author
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    if (project.authorId !== userId) {
      throw new CustomError('Not authorized to view project contributions', 403);
    }

    const contributions = await prisma.contribution.findMany({
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
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { contributions },
    });
  },

  updateContribution: async (req: Request, res: Response): Promise<void> => {
    const { contributionId } = req.params;
    if (!contributionId) {
      throw new Error("Missing contributionId");
    }

    const userId = (req as any).user.id;
    const { status, message } = req.body;

    // Get contribution with project details
    const contribution = await prisma.contribution.findUnique({
      where: { id: contributionId },
      include: {
        project: {
          include: {
            author: true,
          },
        },
        user: true,
      },
    });

    if (!contribution) {
      throw new CustomError('Contribution not found', 404);
    }

    // Check if user is the project author
    if (contribution.project.authorId !== userId) {
      throw new CustomError('Not authorized to update this contribution', 403);
    }

    // Update contribution
    const updatedContribution = await prisma.contribution.update({
      where: { id: contributionId },
      data: { status },
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
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // If accepted, add user to project members
    if (status === 'ACCEPTED') {
      await prisma.projectMember.create({
        data: {
          projectId: contribution.projectId,
          userId: contribution.userId,
          role: 'CONTRIBUTOR',
        },
      });
    }

    // Send notification email to contributor
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: contribution.user.email,
      subject: `Contribution Request ${status.toLowerCase()} for "${contribution.project.title}"`,
      html: `
        <h2>Contribution Request ${status}</h2>
        <p>Your contribution request for "${contribution.project.title}" has been ${status.toLowerCase()}.</p>
        ${message ? `<p><strong>Message from author:</strong> ${message}</p>` : ''}
        ${status === 'ACCEPTED' ? '<p>You can now join the project chat and start collaborating!</p>' : ''}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }

    res.json({
      success: true,
      message: `Contribution request ${status.toLowerCase()} successfully`,
      data: { contribution: updatedContribution },
    });
  },

  cancelContribution: async (req: Request, res: Response): Promise<void> => {
    const { contributionId } = req.params;
    if (!contributionId) {
      throw new Error("Missing contributionId");
    }

    const userId = (req as any).user.id;

    const contribution = await prisma.contribution.findUnique({
      where: { id: contributionId },
    });

    if (!contribution) {
      throw new CustomError('Contribution not found', 404);
    }

    // Check if user is the contributor
    if (contribution.userId !== userId) {
      throw new CustomError('Not authorized to cancel this contribution', 403);
    }

    // Only allow cancellation if status is PENDING
    if (contribution.status !== 'PENDING') {
      throw new CustomError('Cannot cancel contribution that is not pending', 400);
    }

    await prisma.contribution.delete({
      where: { id: contributionId },
    });

    res.json({
      success: true,
      message: 'Contribution request cancelled successfully',
    });
  },
};
