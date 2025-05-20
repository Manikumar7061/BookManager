import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as BookModel from '../models/book';

// Get all books
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const books = await BookModel.getAllBooks(userId);
    res.status(200).json(books);
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = parseInt(req.params.id);
    const userId = req.user?.userId;
    
    const book = await BookModel.getBookById(bookId, userId);
    
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    
    res.status(200).json(book);
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new book (admin only)
export const addBook = async (req: Request, res: Response): Promise<void> => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { title, author, description, coverImage, content } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const bookId = await BookModel.addBook(
      title,
      author,
      description,
      coverImage,
      content,
      userId
    );
    
    const newBook = await BookModel.getBookById(bookId);
    
    res.status(201).json({
      message: 'Book added successfully',
      book: newBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update reading progress
export const updateReadingProgress = async (req: Request, res: Response): Promise<void> => {
  const bookId = parseInt(req.params.id);
  const { currentPosition, isCompleted } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    await BookModel.updateReadingProgress(
      userId,
      bookId,
      currentPosition,
      isCompleted
    );
    
    res.status(200).json({ message: 'Reading progress updated successfully' });
  } catch (error) {
    console.error('Update reading progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle favorite status
export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  const bookId = parseInt(req.params.id);
  const { isFavorite } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    await BookModel.toggleFavorite(userId, bookId, isFavorite);
    
    res.status(200).json({ 
      message: isFavorite 
        ? 'Book added to favorites' 
        : 'Book removed from favorites' 
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get favorite books
export const getFavoriteBooks = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const books = await BookModel.getFavoriteBooks(userId);
    res.status(200).json(books);
  } catch (error) {
    console.error('Get favorite books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get completed books
export const getCompletedBooks = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const books = await BookModel.getCompletedBooks(userId);
    res.status(200).json(books);
  } catch (error) {
    console.error('Get completed books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get in-progress books
export const getInProgressBooks = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    const books = await BookModel.getInProgressBooks(userId);
    res.status(200).json(books);
  } catch (error) {
    console.error('Get in-progress books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a book (admin only)
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const bookId = parseInt(req.params.id);
  const { title, author, description, coverImage, content } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    // Check if book exists
    const book = await BookModel.getBookById(bookId);
    
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    
    await BookModel.updateBook(
      bookId,
      title,
      author,
      description,
      coverImage,
      content
    );
    
    const updatedBook = await BookModel.getBookById(bookId);
    
    res.status(200).json({
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a book (admin only)
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  const bookId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  try {
    // Check if book exists
    const book = await BookModel.getBookById(bookId);
    
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    
    await BookModel.deleteBook(bookId);
    
    res.status(200).json({
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 