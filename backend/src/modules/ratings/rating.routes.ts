import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest, asyncHandler } from '../../middleware/errorHandler';
import { authenticateToken } from '../../middleware/auth';
import { ratingController } from './rating.controller';

const router = Router();

// Validation rules
const createRatingValidation = [
    body('receiverId')
        .notEmpty()
        .withMessage('Receiver ID is required'),
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Comment must be less than 500 characters'),
    body('projectId')
        .optional()
        .isString()
        .withMessage('Project ID must be a string'),
];

const updateRatingValidation = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Comment must be less than 500 characters'),
];

// Routes
router.post('/', authenticateToken, createRatingValidation, validateRequest, asyncHandler(ratingController.createRating));
router.get('/my-ratings', authenticateToken, asyncHandler(ratingController.getMyRatings));
router.get('/user/:userId', authenticateToken, asyncHandler(ratingController.getUserRatings));
router.put('/:ratingId', authenticateToken, updateRatingValidation, validateRequest, asyncHandler(ratingController.updateRating));
router.delete('/:ratingId', authenticateToken, asyncHandler(ratingController.deleteRating));

export default router;
