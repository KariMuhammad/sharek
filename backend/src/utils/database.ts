import prisma from './database';
import { CustomError } from '../middleware/errorHandler';

export class DatabaseService {
    /**
     * Execute a transaction with automatic rollback on error
     */
    static async transaction<T>(
        callback: (tx: typeof prisma) => Promise<T>
    ): Promise<T> {
        return prisma.$transaction(callback);
    }

    /**
     * Check if a record exists
     */
    static async exists(model: string, where: any): Promise<boolean> {
        try {
            const count = await (prisma as any)[model].count({ where });
            return count > 0;
        } catch (error) {
            throw new CustomError(`Failed to check existence for ${model}`, 500);
        }
    }

    /**
     * Find a record or throw error
     */
    static async findUniqueOrThrow<T>(
        model: string,
        where: any,
        errorMessage: string = 'Record not found'
    ): Promise<T> {
        try {
            const record = await (prisma as any)[model].findUnique({ where });
            if (!record) {
                throw new CustomError(errorMessage, 404);
            }
            return record;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(`Failed to find ${model}`, 500);
        }
    }

    /**
     * Create a record with error handling
     */
    static async create<T>(
        model: string,
        data: any,
        include?: any
    ): Promise<T> {
        try {
            return await (prisma as any)[model].create({
                data,
                ...(include && { include }),
            });
        } catch (error) {
            throw new CustomError(`Failed to create ${model}`, 500);
        }
    }

    /**
     * Update a record with error handling
     */
    static async update<T>(
        model: string,
        where: any,
        data: any,
        include?: any
    ): Promise<T> {
        try {
            return await (prisma as any)[model].update({
                where,
                data,
                ...(include && { include }),
            });
        } catch (error) {
            throw new CustomError(`Failed to update ${model}`, 500);
        }
    }

    /**
     * Delete a record with error handling
     */
    static async delete<T>(
        model: string,
        where: any
    ): Promise<T> {
        try {
            return await (prisma as any)[model].delete({ where });
        } catch (error) {
            throw new CustomError(`Failed to delete ${model}`, 500);
        }
    }

    /**
     * Find many records with pagination
     */
    static async findManyWithPagination<T>(
        model: string,
        options: {
            where?: any;
            include?: any;
            orderBy?: any;
            page?: number;
            limit?: number;
        }
    ): Promise<{
        data: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }> {
        const { where, include, orderBy, page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        try {
            const [data, total] = await Promise.all([
                (prisma as any)[model].findMany({
                    where,
                    include,
                    orderBy,
                    skip,
                    take: limit,
                }),
                (prisma as any)[model].count({ where }),
            ]);

            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new CustomError(`Failed to fetch ${model}`, 500);
        }
    }

    /**
     * Soft delete a record (if supported by model)
     */
    static async softDelete<T>(
        model: string,
        where: any
    ): Promise<T> {
        try {
            return await (prisma as any)[model].update({
                where,
                data: { isActive: false, updatedAt: new Date() },
            });
        } catch (error) {
            throw new CustomError(`Failed to soft delete ${model}`, 500);
        }
    }

    /**
     * Restore a soft deleted record
     */
    static async restore<T>(
        model: string,
        where: any
    ): Promise<T> {
        try {
            return await (prisma as any)[model].update({
                where,
                data: { isActive: true, updatedAt: new Date() },
            });
        } catch (error) {
            throw new CustomError(`Failed to restore ${model}`, 500);
        }
    }

    /**
     * Get database statistics
     */
    static async getStats(): Promise<{
        users: number;
        projects: number;
        contributions: number;
        messages: number;
        notifications: number;
    }> {
        try {
            const [users, projects, contributions, messages, notifications] = await Promise.all([
                prisma.user.count(),
                prisma.project.count(),
                prisma.contribution.count(),
                prisma.chatMessage.count(),
                prisma.notification.count(),
            ]);

            return {
                users,
                projects,
                contributions,
                messages,
                notifications,
            };
        } catch (error) {
            throw new CustomError('Failed to get database statistics', 500);
        }
    }
}

export default DatabaseService;
