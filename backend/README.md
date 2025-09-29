# Sharek Backend API

A comprehensive backend API for the Sharek contribution platform built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Project Management**: Create, update, delete, and manage projects
- **Contribution System**: Request, accept, and manage contributions
- **Real-time Chat**: Socket.IO powered project chat rooms
- **Notifications**: Email and in-app notifications
- **File Uploads**: Support for project attachments
- **Rating System**: Rate contributors and authors
- **Search & Filtering**: Advanced project discovery

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator
- **Authentication**: JWT, bcrypt

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.ts      # Main config
│   │   ├── database.ts   # Prisma client
│   │   ├── redis.ts      # Redis client
│   │   └── email.ts      # Email transporter
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Authentication
│   │   ├── errorHandler.ts # Error handling
│   │   └── upload.ts     # File upload
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── users/        # User management
│   │   ├── projects/     # Project management
│   │   ├── contributions/ # Contribution system
│   │   ├── chat/         # Chat functionality
│   │   └── notifications/ # Notifications
│   ├── utils/            # Utility functions
│   │   ├── auth.ts       # Auth utilities
│   │   ├── socket.ts     # Socket.IO setup
│   │   ├── notifications.ts # Notification helpers
│   │   └── project.ts    # Project utilities
│   └── server.ts         # Main server file
├── prisma/
│   └── schema.prisma     # Database schema
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.json
└── env.example
```

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- PostgreSQL
- Redis
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/sharek_db

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/skills` - Update skills
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/projects` - Get user projects
- `GET /api/users/:userId/contributions` - Get user contributions
- `GET /api/users/:userId/ratings` - Get user ratings

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/search` - Search projects
- `GET /api/projects/trending` - Get trending projects
- `GET /api/projects/:projectId` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/:projectId/upload` - Upload file
- `GET /api/projects/:projectId/members` - Get project members
- `GET /api/projects/:projectId/chat` - Get chat messages

### Contributions
- `POST /api/contributions/request/:projectId` - Request contribution
- `GET /api/contributions/my-requests` - Get my requests
- `GET /api/contributions/project/:projectId` - Get project contributions
- `PUT /api/contributions/:contributionId` - Update contribution
- `DELETE /api/contributions/:contributionId` - Cancel contribution

### Chat
- `GET /api/chat/:projectId/messages` - Get chat messages
- `POST /api/chat/:projectId/messages` - Send message
- `DELETE /api/chat/messages/:messageId` - Delete message

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/mark-read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

## Socket.IO Events

### Client to Server
- `join-project` - Join project room
- `leave-project` - Leave project room
- `send-message` - Send chat message
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `contribution-request` - Notify contribution request
- `project-update` - Notify project update

### Server to Client
- `new-message` - New chat message
- `user-typing` - User typing indicator
- `user-stopped-typing` - User stopped typing
- `contribution-requested` - New contribution request
- `project-updated` - Project update notification

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: User accounts and profiles
- **Projects**: Project information and metadata
- **Contributions**: Contribution requests and status
- **ProjectMembers**: Project membership and roles
- **ChatMessages**: Project chat messages
- **Ratings**: User ratings and reviews
- **Attachments**: Project file attachments
- **Notifications**: User notifications

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- File upload restrictions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
