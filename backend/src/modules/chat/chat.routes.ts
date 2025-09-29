import { Router } from 'express';
import { body } from 'express-validator';
// import { AuthRequest } from '../../middleware/auth';
import { validateRequest, asyncHandler } from '../../middleware/errorHandler';
import { authenticateToken } from '../../middleware/auth';
import { chatController } from './chat.controller';

const router = Router();

// Validation rules
const sendMessageValidation = [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be 1-1000 characters'),
  body('isCommand')
    .optional()
    .isBoolean()
    .withMessage('isCommand must be a boolean'),
];

// Routes
router.get('/:projectId/messages', authenticateToken, asyncHandler(chatController.getMessages));
router.post('/:projectId/messages', authenticateToken, sendMessageValidation, validateRequest, asyncHandler(chatController.sendMessage));
router.delete('/messages/:messageId', authenticateToken, asyncHandler(chatController.deleteMessage));

export default router;
