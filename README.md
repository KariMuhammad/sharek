# Sharek - Developer Collaboration Platform

A comprehensive platform that enables developers to create projects, find collaborators, and build amazing things together.

## Project Structure

```
sharek/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js backend API
├── docs/              # Documentation and guides
└── README.md          # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Redis (optional, for caching)

### 1. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Configure your .env file
npm run db:migrate:seed
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Project Management**: Create, update, and manage projects
- **Collaboration**: Request to join projects and work together
- **Real-time Chat**: Project-specific chat rooms
- **Search & Discovery**: Find projects by technology, category, or keywords
- **Notifications**: Stay updated on project activities

### Technical Features
- **Modern Stack**: Next.js, Node.js, PostgreSQL, Redis
- **Real-time Communication**: Socket.IO for live updates
- **Responsive Design**: Works on all devices
- **Type Safety**: Full TypeScript implementation
- **Security**: JWT authentication, input validation, rate limiting
- **Performance**: Optimized queries, caching, and lazy loading

## Documentation

- [Architecture Overview](docs/ARCH.md)
- [Requirements Specification](docs/REQUIREMENTS.md)
- [Database Setup](backend/docs/DATABASE.md)
- [Frontend Guide](frontend/README.md)
- [Backend API](backend/README.md)

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linting
npm run type-check   # Type checking
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run db:studio    # Open database GUI
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:
1. Check the documentation in the `docs/` folder
2. Look at existing issues on GitHub
3. Create a new issue if needed

---

**Built with ❤️ by the Sharek team**