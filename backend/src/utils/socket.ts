import { Server as SocketIOServer } from 'socket.io';
import { authenticateSocket } from './socketAuth';

export const setupSocketIO = (io: SocketIOServer): void => {
  // Authentication middleware for socket connections
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join project room
    socket.on('join-project', (projectId: string) => {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project-${projectId}`);
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    // Handle chat messages
    socket.on('send-message', (data: {
      projectId: string;
      content: string;
      isCommand?: boolean;
    }) => {
      // Broadcast message to all users in the project room
      socket.to(`project-${data.projectId}`).emit('new-message', {
        id: Date.now().toString(),
        content: data.content,
        isCommand: data.isCommand || false,
        userId: socket.data.userId,
        username: socket.data.username,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle typing indicators
    socket.on('typing-start', (data: { projectId: string }) => {
      socket.to(`project-${data.projectId}`).emit('user-typing', {
        userId: socket.data.userId,
        username: socket.data.username,
      });
    });

    socket.on('typing-stop', (data: { projectId: string }) => {
      socket.to(`project-${data.projectId}`).emit('user-stopped-typing', {
        userId: socket.data.userId,
      });
    });

    // Handle contribution notifications
    socket.on('contribution-request', (data: {
      projectId: string;
      contributorId: string;
      contributorName: string;
    }) => {
      // Notify project author about new contribution request
      socket.to(`project-${data.projectId}`).emit('contribution-requested', {
        contributorId: data.contributorId,
        contributorName: data.contributorName,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle project updates
    socket.on('project-update', (data: {
      projectId: string;
      updateType: string;
      message: string;
    }) => {
      socket.to(`project-${data.projectId}`).emit('project-updated', {
        updateType: data.updateType,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
