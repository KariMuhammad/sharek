import jwt from 'jsonwebtoken';
import config from '../config';
import { Socket } from 'socket.io';

export const authenticateSocket = async (socket: Socket, next: (err?: Error) => void): Promise<void> => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    
    // You can fetch user data from database here if needed
    socket.data.userId = decoded.userId;
    socket.data.username = decoded.userId; // You might want to fetch actual username
    
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};
