import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import * as booksController from '../controllers/books';
import { auth, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all books (authenticated)
router.get('/', auth, booksController.getAllBooks);

// Get a specific book (authenticated)
router.get('/:id', auth, booksController.getBookById);

// Add a new book (admin only)
router.post(
  '/',
  [
    auth,
    isAdmin,
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('author').trim().not().isEmpty().withMessage('Author is required'),
    body('description').trim().not().isEmpty().withMessage('Description is required'),
    body('coverImage').trim().not().isEmpty().withMessage('Cover image URL is required'),
    body('content').trim().not().isEmpty().withMessage('Book content is required')
  ],
  booksController.addBook
);

// Update reading progress (authenticated)
router.put('/progress/:id', auth, booksController.updateReadingProgress);

// Toggle favorite status (authenticated)
router.put('/favorite/:id', auth, booksController.toggleFavorite);

// Get favorite books (authenticated)
router.get('/favorites/list', auth, booksController.getFavoriteBooks);

// Get completed books (authenticated)
router.get('/completed/list', auth, booksController.getCompletedBooks);

// Get in-progress books (authenticated)
router.get('/in-progress/list', auth, booksController.getInProgressBooks);

// Update a book (admin only)
router.put(
  '/:id',
  [
    auth,
    isAdmin,
    body('title').trim().not().isEmpty().withMessage('Title is required'),
    body('author').trim().not().isEmpty().withMessage('Author is required'),
    body('description').trim().not().isEmpty().withMessage('Description is required'),
    body('coverImage').trim().not().isEmpty().withMessage('Cover image URL is required'),
    body('content').trim().not().isEmpty().withMessage('Book content is required')
  ],
  booksController.updateBook
);

// Delete a book (admin only)
router.delete(
  '/:id',
  [auth, isAdmin],
  booksController.deleteBook
);

export default router; 