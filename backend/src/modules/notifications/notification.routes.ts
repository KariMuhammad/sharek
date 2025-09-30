import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest, asyncHandler } from '../../middleware/errorHandler';
import { authenticateToken } from '../../middleware/auth';
import { notificationController } from './notification.controller';

const router = Router();

// Validation rules
const createNotificationValidation = [
  body('type')
    .isIn(['CONTRIBUTION_REQUEST', 'CONTRIBUTION_ACCEPTED', 'CONTRIBUTION_REJECTED', 'PROJECT_UPDATE', 'CHAT_MESSAGE', 'RATING_RECEIVED', 'SYSTEM'])
    .withMessage('Invalid notification type'),
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be 1-100 characters'),
  body('message')
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be 1-500 characters'),
  body('data')
    .optional()
    .isObject()
    .withMessage('Data must be an object'),
];

// const markAsReadValidation = [
//   body('notificationIds')
//     .isArray()
//     .withMessage('Notification IDs must be an array'),
// ];

// Routes
router.get('/', authenticateToken, asyncHandler(notificationController.getNotifications));
router.get('/unread-count', authenticateToken, asyncHandler(notificationController.getUnreadCount));
router.post('/', authenticateToken, createNotificationValidation, validateRequest, asyncHandler(notificationController.createNotification));
router.patch('/:notificationId/read', authenticateToken, asyncHandler(notificationController.markAsRead));
router.patch('/read-all', authenticateToken, asyncHandler(notificationController.markAllAsRead));
router.delete('/:notificationId', authenticateToken, asyncHandler(notificationController.deleteNotification));

export default router;
