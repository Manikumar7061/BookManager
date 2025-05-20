import express, { Request, Response } from 'express';

const router = express.Router();

// Get user profile
router.get('/profile', (req: Request, res: Response) => {
  // This will be replaced with the actual controller
  res.status(200).json({ message: 'User profile retrieved successfully' });
});

// Get user's reading history
router.get('/reading-history', (req: Request, res: Response) => {
  // This will be replaced with the actual controller
  res.status(200).json({ message: 'Reading history retrieved successfully' });
});

// Get user's favorite books
router.get('/favorites', (req: Request, res: Response) => {
  // This will be replaced with the actual controller
  res.status(200).json({ message: 'Favorite books retrieved successfully' });
});

export default router; 