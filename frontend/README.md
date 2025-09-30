# Sharek Frontend

A modern web application for the Sharek developer collaboration platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Authentication**: Complete login/register system with JWT tokens
- **Project Discovery**: Browse, search, and filter projects
- **Real-time Features**: Notifications and live updates
- **Responsive Design**: Works perfectly on all devices
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Authentication**: JWT with HTTP-only cookies
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   └── projects/        # Projects pages
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components
│   │   ├── layout/          # Layout components
│   │   ├── home/            # Homepage components
│   │   ├── projects/        # Project components
│   │   └── notifications/   # Notification components
│   └── contexts/            # React contexts
├── public/                  # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Key Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Social login ready (GitHub, Google)

### Project Management
- Browse all projects
- Advanced search and filtering
- Grid/List view toggle
- Project categories and tags

### User Interface
- Responsive navigation
- Real-time notifications
- Toast messages
- Loading states
- Error handling

### Design System
- Consistent color palette
- Reusable UI components
- Smooth animations
- Mobile-first approach

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## API Integration

The frontend is designed to work with the Sharek backend API. Make sure the backend server is running on `http://localhost:3001` or update the API URL in your environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License