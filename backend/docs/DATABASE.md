# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Sharek backend application.

## Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 18+ installed
- npm or yarn package manager

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your database:

```bash
cp env.example .env
```

Edit `.env` and update the database configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/sharek_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sharek_db
DB_USER=username
DB_PASSWORD=password
```

### 3. Create Database

Create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sharek_db;

# Create user (optional)
CREATE USER sharek_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sharek_db TO sharek_user;

# Exit psql
\q
```

### 4. Run Migrations and Seed

```bash
# Generate Prisma client
npm run db:generate

# Run migrations and seed database
npm run db:migrate:seed
```

### 5. Verify Setup

```bash
# Test database connection
npm run db:test

# Test schema
npm run db:test:schema

# Open Prisma Studio (optional)
npm run db:studio
```

## Database Scripts

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Run database migrations |
| `npm run db:migrate:seed` | Run migrations and seed database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database (⚠️ destructive) |
| `npm run db:backup` | Create database backup |
| `npm run db:restore` | Restore from backup |
| `npm run db:deploy` | Deploy migrations (production) |
| `npm run db:status` | Check migration status |
| `npm run db:test` | Test database connection |
| `npm run db:test:schema` | Test database schema |

### Migration Commands

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database and apply all migrations
npm run db:reset

# Check migration status
npm run db:status
```

### Backup and Restore

```bash
# Create backup
npm run db:backup

# Restore from backup
npm run db:restore path/to/backup.sql.gz
```

## Database Schema

The application uses the following main entities:

### Core Entities

- **Users**: User accounts and profiles
- **Projects**: Project information and metadata
- **Contributions**: Contribution requests and status
- **ProjectMembers**: Project membership and roles
- **ChatMessages**: Project chat messages
- **Ratings**: User ratings and reviews
- **Attachments**: Project file attachments
- **Notifications**: User notifications

### Relationships

- Users can create multiple Projects (1:many)
- Users can contribute to multiple Projects (many:many via Contributions)
- Projects have multiple Members (1:many via ProjectMembers)
- Projects have multiple ChatMessages (1:many)
- Users can rate each other (many:many via Ratings)
- Users receive multiple Notifications (1:many)

## Sample Data

The seed script creates:

- **4 users** (including admin)
- **3 sample projects** with different statuses
- **4 project memberships**
- **2 contribution requests**
- **3 chat messages**
- **2 ratings**
- **2 notifications**

### Default Login Credentials

- **Admin**: `admin@sharek.com` / `admin123`
- **User 1**: `john.doe@example.com` / `user123`
- **User 2**: `jane.smith@example.com` / `user123`
- **User 3**: `mike.wilson@example.com` / `user123`

## Production Setup

### Environment Variables

For production, ensure these environment variables are set:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://host:port
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### Database Migrations

For production deployments:

```bash
# Deploy migrations (production)
npm run db:deploy

# Generate Prisma client
npm run db:generate
```

### Backup Strategy

Set up automated backups:

```bash
# Add to crontab for daily backups
0 2 * * * cd /path/to/backend && npm run db:backup
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if PostgreSQL is running
   - Verify connection details in `.env`
   - Check firewall settings

2. **Authentication Failed**
   - Verify username and password
   - Check user permissions
   - Ensure user has access to database

3. **Migration Errors**
   - Check database permissions
   - Ensure database exists
   - Run `npm run db:generate` first

4. **Prisma Client Errors**
   - Run `npm run db:generate`
   - Check if migrations are up to date
   - Verify schema.prisma syntax

### Debug Commands

```bash
# Check database connection
npm run db:test

# Check migration status
npm run db:status

# View database in Prisma Studio
npm run db:studio

# Reset and reseed (⚠️ destructive)
npm run db:reset
```

## Performance Optimization

### Database Indexes

The schema includes optimized indexes for:
- User email and username lookups
- Project searches and filtering
- Contribution status queries
- Chat message ordering
- Notification queries

### Connection Pooling

Prisma automatically handles connection pooling. For high-traffic applications, consider:
- Using a connection pooler like PgBouncer
- Adjusting Prisma connection limits
- Implementing read replicas for read-heavy workloads

## Security Considerations

- Use strong passwords for database users
- Enable SSL connections in production
- Regularly update PostgreSQL
- Implement proper backup encryption
- Use environment variables for sensitive data
- Regular security audits

## Monitoring

Monitor database health with:

```bash
# Health check endpoint
curl http://localhost:3001/health

# Database statistics
npm run db:test:schema
```

For production monitoring, consider:
- PostgreSQL performance monitoring
- Query performance analysis
- Connection pool monitoring
- Backup verification
