import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import config from '../src/config';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', config.BCRYPT_ROUNDS);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@sharek.com' },
        update: {},
        create: {
            email: 'admin@sharek.com',
            username: 'admin',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            bio: 'System administrator for Sharek platform',
            skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'React', 'Next.js'],
            isActive: true,
        },
    });

    // Create sample users
    const user1Password = await bcrypt.hash('user123', config.BCRYPT_ROUNDS);
    const user1 = await prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: user1Password,
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Full-stack developer with 5 years of experience',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Docker'],
            isActive: true,
        },
    });

    const user2Password = await bcrypt.hash('user123', config.BCRYPT_ROUNDS);
    const user2 = await prisma.user.upsert({
        where: { email: 'jane.smith@example.com' },
        update: {},
        create: {
            email: 'jane.smith@example.com',
            username: 'janesmith',
            password: user2Password,
            firstName: 'Jane',
            lastName: 'Smith',
            bio: 'Frontend specialist and UI/UX designer',
            skills: ['React', 'Vue.js', 'CSS', 'Figma', 'TypeScript'],
            isActive: true,
        },
    });

    const user3Password = await bcrypt.hash('user123', config.BCRYPT_ROUNDS);
    const user3 = await prisma.user.upsert({
        where: { email: 'mike.wilson@example.com' },
        update: {},
        create: {
            email: 'mike.wilson@example.com',
            username: 'mikewilson',
            password: user3Password,
            firstName: 'Mike',
            lastName: 'Wilson',
            bio: 'Backend developer and DevOps engineer',
            skills: ['Python', 'Django', 'AWS', 'Kubernetes', 'PostgreSQL'],
            isActive: true,
        },
    });

    // Create sample projects
    const project1 = await prisma.project.upsert({
        where: { id: 'project-1' },
        update: {},
        create: {
            id: 'project-1',
            title: 'E-commerce Platform',
            description: 'A modern e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
            purpose: 'Create a scalable e-commerce solution for small to medium businesses',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
            tasks: [
                'Set up project structure and dependencies',
                'Implement user authentication and authorization',
                'Create product catalog with search and filtering',
                'Build shopping cart functionality',
                'Integrate payment processing with Stripe',
                'Develop admin dashboard for product management',
                'Add order tracking and email notifications',
                'Implement responsive design for mobile devices'
            ],
            githubLink: 'https://github.com/johndoe/ecommerce-platform',
            status: 'ACTIVE',
            price: 500.00,
            authorId: user1.id,
        },
    });

    const project2 = await prisma.project.upsert({
        where: { id: 'project-2' },
        update: {},
        create: {
            id: 'project-2',
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.',
            purpose: 'Help teams organize and track their work more effectively',
            technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
            tasks: [
                'Design user interface and user experience',
                'Implement user registration and login',
                'Create project and task management features',
                'Add real-time collaboration with Socket.io',
                'Build team management and permissions',
                'Implement file upload and sharing',
                'Add notifications and email alerts',
                'Create mobile-responsive design'
            ],
            githubLink: 'https://github.com/janesmith/task-manager',
            status: 'PENDING',
            price: 300.00,
            authorId: user2.id,
        },
    });

    const project3 = await prisma.project.upsert({
        where: { id: 'project-3' },
        update: {},
        create: {
            id: 'project-3',
            title: 'API Gateway Service',
            description: 'A microservices API gateway with authentication, rate limiting, load balancing, and monitoring capabilities.',
            purpose: 'Create a robust API gateway for microservices architecture',
            technologies: ['Python', 'FastAPI', 'Redis', 'Docker', 'Kubernetes'],
            tasks: [
                'Design API gateway architecture',
                'Implement authentication and authorization',
                'Add rate limiting and throttling',
                'Create load balancing and routing',
                'Implement monitoring and logging',
                'Add API documentation with Swagger',
                'Set up Docker containerization',
                'Deploy to Kubernetes cluster'
            ],
            githubLink: 'https://github.com/mikewilson/api-gateway',
            status: 'ACTIVE',
            price: 750.00,
            authorId: user3.id,
        },
    });

    // Create project memberships
    await prisma.projectMember.upsert({
        where: { id: 'member-1' },
        update: {},
        create: {
            id: 'member-1',
            projectId: project1.id,
            userId: user1.id,
            role: 'AUTHOR',
        },
    });

    await prisma.projectMember.upsert({
        where: { id: 'member-2' },
        update: {},
        create: {
            id: 'member-2',
            projectId: project1.id,
            userId: user2.id,
            role: 'CONTRIBUTOR',
        },
    });

    await prisma.projectMember.upsert({
        where: { id: 'member-3' },
        update: {},
        create: {
            id: 'member-3',
            projectId: project2.id,
            userId: user2.id,
            role: 'AUTHOR',
        },
    });

    await prisma.projectMember.upsert({
        where: { id: 'member-4' },
        update: {},
        create: {
            id: 'member-4',
            projectId: project3.id,
            userId: user3.id,
            role: 'AUTHOR',
        },
    });

    // Create sample contributions
    await prisma.contribution.upsert({
        where: { id: 'contrib-1' },
        update: {},
        create: {
            id: 'contrib-1',
            projectId: project1.id,
            userId: user2.id,
            status: 'ACCEPTED',
            message: 'I have experience with React and e-commerce platforms. I can help with the frontend development and payment integration.',
        },
    });

    await prisma.contribution.upsert({
        where: { id: 'contrib-2' },
        update: {},
        create: {
            id: 'contrib-2',
            projectId: project2.id,
            userId: user1.id,
            status: 'PENDING',
            message: 'I can help with the backend development and real-time features using Socket.io.',
        },
    });

    // Create sample chat messages
    await prisma.chatMessage.createMany({
        data: [
            {
                projectId: project1.id,
                userId: user1.id,
                content: 'Welcome to the E-commerce Platform project! Let\'s start by setting up the project structure.',
                isCommand: true,
            },
            {
                projectId: project1.id,
                userId: user2.id,
                content: 'Thanks for having me! I\'m excited to work on this project. Should we start with the authentication system?',
                isCommand: false,
            },
            {
                projectId: project1.id,
                userId: user1.id,
                content: 'Yes, that sounds good. I\'ll create the user registration and login endpoints first.',
                isCommand: true,
            },
        ],
        skipDuplicates: true,
    });

    // Create sample ratings
    await prisma.rating.createMany({
        data: [
            {
                senderId: user1.id,
                receiverId: user2.id,
                projectId: project1.id,
                rating: 5,
                comment: 'Excellent work on the frontend! Very responsive and user-friendly.',
            },
            {
                senderId: user2.id,
                receiverId: user1.id,
                projectId: project1.id,
                rating: 5,
                comment: 'Great project management and clear communication throughout the development process.',
            },
        ],
        skipDuplicates: true,
    });

    // Create sample notifications
    await prisma.notification.createMany({
        data: [
            {
                userId: user1.id,
                type: 'CONTRIBUTION_REQUEST',
                title: 'New Contribution Request',
                message: 'Jane Smith has requested to contribute to your E-commerce Platform project.',
                data: { projectId: project1.id, contributorId: user2.id },
            },
            {
                userId: user2.id,
                type: 'CONTRIBUTION_ACCEPTED',
                title: 'Contribution Request Accepted',
                message: 'Your contribution request for E-commerce Platform has been accepted!',
                data: { projectId: project1.id },
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created:');
    console.log(`   - 4 users (including admin)`);
    console.log(`   - 3 projects`);
    console.log(`   - 4 project memberships`);
    console.log(`   - 2 contributions`);
    console.log(`   - 3 chat messages`);
    console.log(`   - 2 ratings`);
    console.log(`   - 2 notifications`);
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Admin: admin@sharek.com / admin123');
    console.log('   User 1: john.doe@example.com / user123');
    console.log('   User 2: jane.smith@example.com / user123');
    console.log('   User 3: mike.wilson@example.com / user123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
