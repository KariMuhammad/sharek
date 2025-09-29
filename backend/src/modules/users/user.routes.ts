import { Router } from 'express';
import { body } from 'express-validator';
// import { AuthRequest } from '../../middleware/auth';
import { validateRequest, asyncHandler } from '@/middleware/errorHandler';
import { authenticateToken } from '@/middleware/auth';
import { userController } from './user.controller';

const router = Router();

// Validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be 1-50 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be 1-50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
];

const updateSkillsValidation = [
  body('skills')
    .isArray()
    .withMessage('Skills must be an array'),
];

// Routes
router.get('/profile', authenticateToken, asyncHandler(userController.getProfile));
router.put('/profile', authenticateToken, updateProfileValidation, validateRequest, asyncHandler(userController.updateProfile));
router.put('/skills', authenticateToken, updateSkillsValidation, validateRequest, asyncHandler(userController.updateSkills));
router.get('/:userId', authenticateToken, asyncHandler(userController.getUserProfile));
router.get('/:userId/projects', authenticateToken, asyncHandler(userController.getUserProjects));
router.get('/:userId/contributions', authenticateToken, asyncHandler(userController.getUserContributions));
router.get('/:userId/ratings', authenticateToken, asyncHandler(userController.getUserRatings));

export default router;
