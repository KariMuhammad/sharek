#!/usr/bin/env node

import { config } from 'dotenv';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth } from '../src/config/database';
import prisma from '../src/config/database';

// Load environment variables
config();

const testDatabaseConnection = async () => {
    console.log('🧪 Testing database connection...');

    try {
        // Test basic connection
        await connectDatabase();
        console.log('✅ Database connection successful');

        // Test health check
        const isHealthy = await checkDatabaseHealth();
        console.log(`✅ Database health check: ${isHealthy ? 'PASSED' : 'FAILED'}`);

        // Test basic query
        const userCount = await prisma.user.count();
        console.log(`✅ Basic query test: Found ${userCount} users`);

        // Test transaction
        await prisma.$transaction(async (tx) => {
            await tx.user.findFirst();
        });
        console.log('✅ Transaction test: PASSED');

        console.log('🎉 All database tests passed successfully!');

    } catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    } finally {
        await disconnectDatabase();
    }
};

const testDatabaseSchema = async () => {
    console.log('🔍 Testing database schema...');

    try {
        await connectDatabase();

        // Test all models exist
        const models = ['User', 'Project', 'Contribution', 'ProjectMember', 'Rating', 'ChatMessage', 'Attachment', 'Notification'];

        for (const model of models) {
            try {
                await (prisma as any)[model.toLowerCase()].findFirst();
                console.log(`✅ Model ${model}: OK`);
            } catch (error) {
                console.log(`❌ Model ${model}: FAILED - ${error}`);
            }
        }

        console.log('🎉 Schema test completed!');

    } catch (error) {
        console.error('❌ Schema test failed:', error);
        process.exit(1);
    } finally {
        await disconnectDatabase();
    }
};

const main = () => {
    const args = process.argv.slice(2);

    if (args.includes('--schema')) {
        testDatabaseSchema();
    } else {
        testDatabaseConnection();
    }
};

main();
