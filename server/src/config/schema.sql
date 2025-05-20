-- Create database if not exists
CREATE DATABASE IF NOT EXISTS scoof_kindle;
USE scoof_kindle;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  cover_image VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create reading_progress table to track user's reading progress
CREATE TABLE IF NOT EXISTS reading_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  current_position INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY user_book (user_id, book_id)
);

-- Create favorites table to track user's favorite books
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY user_book (user_id, book_id)
);

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', '$2b$10$vI8aW4l3Vb6yJKGvZ4XFO.hMR5c.0wx9lGdvGGwRwvdj0vKdHE2bq', 'admin');

-- Insert regular user (password: user123)
INSERT INTO users (name, email, password, role)
VALUES ('User', 'user@example.com', '$2b$10$9EepzN.wt2FPIhKsOjIwL.9vbTxe5KXL2KYLzLlY5c09EObLf1.Aq', 'user'); 