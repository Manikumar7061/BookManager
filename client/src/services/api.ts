import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string, role?: string) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Book services
export const bookService = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  getBookById: async (id: number) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  addBook: async (bookData: any) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },
  updateBook: async (id: number, bookData: any) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id: number) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
  updateReadingProgress: async (bookId: number, currentPosition: number, isCompleted: boolean) => {
    const response = await api.put(`/books/progress/${bookId}`, {
      currentPosition,
      isCompleted,
    });
    return response.data;
  },
  toggleFavorite: async (bookId: number, isFavorite: boolean) => {
    const response = await api.put(`/books/favorite/${bookId}`, { isFavorite });
    return response.data;
  },
  getFavoriteBooks: async () => {
    const response = await api.get('/books/favorites/list');
    return response.data;
  },
  getCompletedBooks: async () => {
    const response = await api.get('/books/completed/list');
    return response.data;
  },
  getInProgressBooks: async () => {
    const response = await api.get('/books/in-progress/list');
    return response.data;
  },
};

export default api; 