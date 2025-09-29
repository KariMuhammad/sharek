#!/usr/bin/env node

import { execSync } from 'child_process';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

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

const createBackup = () => {
    console.log('💾 Starting database backup process...');

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    // Parse DATABASE_URL to extract connection details
    const url = new URL(process.env.DATABASE_URL);
    const host = url.hostname;
    const port = url.port || '5432';
    const database = url.pathname.slice(1);
    const username = url.username;
    const password = url.password;

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupsDir, `sharek-backup-${timestamp}.sql`);

    // Set PGPASSWORD environment variable for pg_dump
    process.env.PGPASSWORD = password;

    // Create backup command
    const backupCommand = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --no-password --verbose --clean --no-owner --no-privileges > ${backupFile}`;

    runCommand(backupCommand, `Creating database backup to ${backupFile}`);

    // Compress the backup file
    const compressedFile = `${backupFile}.gz`;
    runCommand(`gzip ${backupFile}`, 'Compressing backup file');

    console.log(`🎉 Database backup completed successfully!`);
    console.log(`📁 Backup saved to: ${compressedFile}`);

    // Clean up old backups (keep last 10)
    try {
        const files = fs.readdirSync(backupsDir)
            .filter(file => file.startsWith('sharek-backup-') && file.endsWith('.sql.gz'))
            .map(file => ({
                name: file,
                path: path.join(backupsDir, file),
                time: fs.statSync(path.join(backupsDir, file)).mtime
            }))
            .sort((a, b) => b.time.getTime() - a.time.getTime());

        if (files.length > 10) {
            const filesToDelete = files.slice(10);
            filesToDelete.forEach(file => {
                fs.unlinkSync(file.path);
                console.log(`🗑️  Deleted old backup: ${file.name}`);
            });
        }
    } catch (error) {
        console.warn('⚠️  Could not clean up old backups:', error);
    }
};

const restoreBackup = (backupFile: string) => {
    console.log('🔄 Starting database restore process...');

    if (!fs.existsSync(backupFile)) {
        console.error(`❌ Backup file not found: ${backupFile}`);
        process.exit(1);
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    // Parse DATABASE_URL to extract connection details
    const url = new URL(process.env.DATABASE_URL);
    const host = url.hostname;
    const port = url.port || '5432';
    const database = url.pathname.slice(1);
    const username = url.username;
    const password = url.password;

    // Set PGPASSWORD environment variable for psql
    process.env.PGPASSWORD = password;

    // Create restore command
    const restoreCommand = `psql -h ${host} -p ${port} -U ${username} -d ${database} --no-password < ${backupFile}`;

    runCommand(restoreCommand, `Restoring database from ${backupFile}`);

    console.log('🎉 Database restore completed successfully!');
};

const main = () => {
    const args = process.argv.slice(2);

    if (args.includes('--restore')) {
        const backupFile = args[args.indexOf('--restore') + 1];
        if (!backupFile) {
            console.error('❌ Please provide backup file path for restore');
            console.log('Usage: npm run db:backup -- --restore <backup-file>');
            process.exit(1);
        }
        restoreBackup(backupFile);
    } else {
        createBackup();
    }
};

main();
