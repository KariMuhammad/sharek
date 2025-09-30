import { Router } from 'express';
import { body } from 'express-validator';
// import { AuthRequest } from '../../middleware/auth';
import { validateRequest, asyncHandler } from '../../middleware/errorHandler';
import { authenticateToken } from '../../middleware/auth';
import { uploadSingle, handleUploadError } from '../../middleware/upload';
import { projectController } from './project.controller';

const router = Router();

// Validation rules
const createProjectValidation = [
  body('title')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be 3-100 characters'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be 10-1000 characters'),
  body('purpose')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Purpose must be less than 500 characters'),
  body('technologies')
    .isArray()
    .withMessage('Technologies must be an array'),
  body('tasks')
    .isArray()
    .withMessage('Tasks must be an array'),
  body('githubLink')
    .optional()
    .isURL()
    .withMessage('GitHub link must be a valid URL'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

const updateProjectValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be 3-100 characters'),
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be 10-1000 characters'),
  body('purpose')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Purpose must be less than 500 characters'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('tasks')
    .optional()
    .isArray()
    .withMessage('Tasks must be an array'),
  body('githubLink')
    .optional()
    .isURL()
    .withMessage('GitHub link must be a valid URL'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('status')
    .optional()
    .isIn(['PENDING', 'ACTIVE', 'FULFILLED', 'CANCELLED'])
    .withMessage('Invalid status'),
];

// Routes
router.get('/', asyncHandler(projectController.getAllProjects)); // Allow browsing without auth
router.get('/search', asyncHandler(projectController.searchProjects)); // Allow searching without auth
router.get('/trending', asyncHandler(projectController.getTrendingProjects)); // Allow trending without auth
router.get('/:projectId', asyncHandler(projectController.getProject)); // Allow viewing project details without auth
router.post('/', authenticateToken, createProjectValidation, validateRequest, asyncHandler(projectController.createProject));
router.put('/:projectId', authenticateToken, updateProjectValidation, validateRequest, asyncHandler(projectController.updateProject));
router.delete('/:projectId', authenticateToken, asyncHandler(projectController.deleteProject));
router.post('/:projectId/upload', authenticateToken, uploadSingle('file'), handleUploadError, asyncHandler(projectController.uploadFile));
router.get('/:projectId/members', authenticateToken, asyncHandler(projectController.getProjectMembers));
router.get('/:projectId/chat', authenticateToken, asyncHandler(projectController.getChatMessages));

export default router;
