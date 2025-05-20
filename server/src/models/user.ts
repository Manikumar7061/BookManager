import pool from '../config/db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

export const findUserById = async (id: number): Promise<User | null> => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

export const createUser = async (name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<number> => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    return (result as any).insertId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
}; 