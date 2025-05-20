import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  CircularProgress, 
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Layout from '../../components/layout/Layout';
import BookCard from '../../components/books/BookCard';
import { bookService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  current_position?: number;
  is_completed?: boolean;
  is_favorite?: boolean;
}

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    fetchBooks();
  }, [tabValue]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response: Book[];
      
      switch (tabValue) {
        case 0: // All books
          const allBooksResponse = await bookService.getAllBooks();
          response = allBooksResponse;
          break;
        case 1: // Favorites
          const favoritesResponse = await bookService.getFavoriteBooks();
          response = favoritesResponse;
          break;
        case 2: // Completed
          const completedResponse = await bookService.getCompletedBooks();
          response = completedResponse;
          break;
        case 3: // In progress
          const inProgressResponse = await bookService.getInProgressBooks();
          response = inProgressResponse;
          break;
        default:
          const defaultResponse = await bookService.getAllBooks();
          response = defaultResponse;
      }
      
      setBooks(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      await bookService.toggleFavorite(id, isFavorite);
      // Update book in the state
      setBooks(books.map(book => 
        book.id === id ? { ...book, is_favorite: isFavorite } : book
      ));
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter books based on search query
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Books Library
          </Typography>
          
          {isAuthenticated && (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ mb: 3 }}
            >
              <Tab label="All Books" />
              <Tab label="Favorites" />
              <Tab label="Completed" />
              <Tab label="In Progress" />
            </Tabs>
          )}

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredBooks.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                {searchQuery 
                  ? 'No books match your search criteria' 
                  : tabValue > 0 
                    ? 'No books in this category yet' 
                    : 'No books available'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {filteredBooks.map((book) => (
                <Box 
                  key={book.id} 
                  sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 16px)' },
                    mb: 2 
                  }}
                >
                  <BookCard
                    book={{
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      cover_image: book.cover_image,
                      current_position: book.current_position,
                      is_completed: book.is_completed,
                      is_favorite: book.is_favorite
                    }}
                    onUpdate={() => fetchBooks()}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default BookListPage; 