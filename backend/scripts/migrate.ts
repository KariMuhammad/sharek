#!/usr/bin/env node

import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load environment variables
config();

const runCommand = (command: string, description: string) => {
    console.log(`🔄 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} completed successfully`);
    } catch (error) {
        console.error(`❌ ${description} failed:`, error);
        process.exit(1);
    }
};

const main = () => {
    console.log('🚀 Starting database migration process...');

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable is not set');
        console.log('Please set DATABASE_URL in your .env file');
        process.exit(1);
    }

    // Generate Prisma client
    runCommand('npx prisma generate', 'Generating Prisma client');

    // Run database migrations
    runCommand('npx prisma migrate dev --name init', 'Running database migrations');

    // Optional: Run seed script
    const shouldSeed = process.argv.includes('--seed');
    if (shouldSeed) {
        runCommand('npx prisma db seed', 'Seeding database');
    }

    console.log('🎉 Database migration process completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Open Prisma Studio: npm run db:studio');
    console.log('3. Check API health: http://localhost:3001/health');
};

main();
