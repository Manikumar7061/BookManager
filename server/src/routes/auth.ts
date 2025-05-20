import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  authController.login
);

// Register route
router.post(
  '/register',
  [
    body('name').trim().not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  authController.register
);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

export default router; 