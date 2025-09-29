import { Router } from 'express';
import { body } from 'express-validator';
// import { AuthRequest } from '../../middleware/auth';
import { validateRequest, asyncHandler } from '../../middleware/errorHandler';
import { authenticateToken } from '../../middleware/auth';
import { contributionController } from './contribution.controller';

const router = Router();

// Validation rules
const requestContributionValidation = [
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message must be less than 500 characters'),
];

const updateContributionValidation = [
  body('status')
    .isIn(['ACCEPTED', 'REJECTED', 'COMPLETED'])
    .withMessage('Invalid status'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message must be less than 500 characters'),
];

// Routes
router.post('/request/:projectId', authenticateToken, requestContributionValidation, validateRequest, asyncHandler(contributionController.requestContribution));
router.get('/my-requests', authenticateToken, asyncHandler(contributionController.getMyRequests));
router.get('/project/:projectId', authenticateToken, asyncHandler(contributionController.getProjectContributions));
router.put('/:contributionId', authenticateToken, updateContributionValidation, validateRequest, asyncHandler(contributionController.updateContribution));
router.delete('/:contributionId', authenticateToken, asyncHandler(contributionController.cancelContribution));

export default router;
