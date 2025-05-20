import pool from '../config/db';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  content: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface BookWithProgress extends Book {
  current_position?: number;
  is_completed?: boolean;
  is_favorite?: boolean;
}

export const getAllBooks = async (userId?: number): Promise<BookWithProgress[]> => {
  try {
    let query = `
      SELECT b.*, 
             rp.current_position, 
             rp.is_completed,
             IF(f.id IS NOT NULL, TRUE, FALSE) as is_favorite
      FROM books b
      LEFT JOIN reading_progress rp ON b.id = rp.book_id AND rp.user_id = ?
      LEFT JOIN favorites f ON b.id = f.book_id AND f.user_id = ?
      ORDER BY b.created_at DESC
    `;
    
    const [rows] = await pool.query(query, [userId || 0, userId || 0]);
    return rows as BookWithProgress[];
  } catch (error) {
    console.error('Error getting all books:', error);
    throw error;
  }
};

export const getBookById = async (id: number, userId?: number): Promise<BookWithProgress | null> => {
  try {
    const query = `
      SELECT b.*, 
             rp.current_position, 
             rp.is_completed,
             IF(f.id IS NOT NULL, TRUE, FALSE) as is_favorite
      FROM books b
      LEFT JOIN reading_progress rp ON b.id = rp.book_id AND rp.user_id = ?
      LEFT JOIN favorites f ON b.id = f.book_id AND f.user_id = ?
      WHERE b.id = ?
    `;
    
    const [rows] = await pool.query(query, [userId || 0, userId || 0, id]);
    const books = rows as BookWithProgress[];
    return books.length > 0 ? books[0] : null;
  } catch (error) {
    console.error('Error getting book by ID:', error);
    throw error;
  }
};

export const addBook = async (
  title: string,
  author: string,
  description: string,
  coverImage: string,
  content: string,
  createdBy: number
): Promise<number> => {
  try {
    const [result] = await pool.query(
      `INSERT INTO books (title, author, description, cover_image, content, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, author, description, coverImage, content, createdBy]
    );
    
    return (result as any).insertId;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateReadingProgress = async (
  userId: number,
  bookId: number,
  currentPosition: number,
  isCompleted: boolean
): Promise<void> => {
  try {
    await pool.query(
      `INSERT INTO reading_progress (user_id, book_id, current_position, is_completed) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       current_position = ?,
       is_completed = ?`,
      [userId, bookId, currentPosition, isCompleted, currentPosition, isCompleted]
    );
  } catch (error) {
    console.error('Error updating reading progress:', error);
    throw error;
  }
};

export const toggleFavorite = async (userId: number, bookId: number, isFavorite: boolean): Promise<void> => {
  try {
    if (isFavorite) {
      await pool.query(
        'INSERT IGNORE INTO favorites (user_id, book_id) VALUES (?, ?)',
        [userId, bookId]
      );
    } else {
      await pool.query(
        'DELETE FROM favorites WHERE user_id = ? AND book_id = ?',
        [userId, bookId]
      );
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    throw error;
  }
};

export const getFavoriteBooks = async (userId: number): Promise<BookWithProgress[]> => {
  try {
    const query = `
      SELECT b.*, 
             rp.current_position, 
             rp.is_completed,
             TRUE as is_favorite
      FROM books b
      INNER JOIN favorites f ON b.id = f.book_id
      LEFT JOIN reading_progress rp ON b.id = rp.book_id AND rp.user_id = ?
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    
    const [rows] = await pool.query(query, [userId, userId]);
    return rows as BookWithProgress[];
  } catch (error) {
    console.error('Error getting favorite books:', error);
    throw error;
  }
};

export const getCompletedBooks = async (userId: number): Promise<BookWithProgress[]> => {
  try {
    const query = `
      SELECT b.*, 
             rp.current_position, 
             rp.is_completed,
             IF(f.id IS NOT NULL, TRUE, FALSE) as is_favorite
      FROM books b
      INNER JOIN reading_progress rp ON b.id = rp.book_id
      LEFT JOIN favorites f ON b.id = f.book_id AND f.user_id = ?
      WHERE rp.user_id = ? AND rp.is_completed = TRUE
      ORDER BY rp.last_read_at DESC
    `;
    
    const [rows] = await pool.query(query, [userId, userId]);
    return rows as BookWithProgress[];
  } catch (error) {
    console.error('Error getting completed books:', error);
    throw error;
  }
};

export const getInProgressBooks = async (userId: number): Promise<BookWithProgress[]> => {
  try {
    const query = `
      SELECT b.*, 
             rp.current_position, 
             rp.is_completed,
             IF(f.id IS NOT NULL, TRUE, FALSE) as is_favorite
      FROM books b
      INNER JOIN reading_progress rp ON b.id = rp.book_id
      LEFT JOIN favorites f ON b.id = f.book_id AND f.user_id = ?
      WHERE rp.user_id = ? AND rp.is_completed = FALSE
      ORDER BY rp.last_read_at DESC
    `;
    
    const [rows] = await pool.query(query, [userId, userId]);
    return rows as BookWithProgress[];
  } catch (error) {
    console.error('Error getting in-progress books:', error);
    throw error;
  }
};

export const updateBook = async (
  id: number,
  title: string,
  author: string,
  description: string,
  coverImage: string,
  content: string
): Promise<void> => {
  try {
    await pool.query(
      `UPDATE books 
       SET title = ?, author = ?, description = ?, cover_image = ?, content = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, author, description, coverImage, content, id]
    );
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id: number): Promise<void> => {
  try {
    // First delete related reading_progress and favorites records
    await pool.query('DELETE FROM reading_progress WHERE book_id = ?', [id]);
    await pool.query('DELETE FROM favorites WHERE book_id = ?', [id]);
    
    // Then delete the book
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}; 