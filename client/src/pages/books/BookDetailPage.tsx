import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../../components/layout/Layout';
import BookReader from '../../components/books/BookReader';
import { bookService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  content: string;
  current_position?: number;
  is_completed?: boolean;
  is_favorite?: boolean;
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [readerMode, setReaderMode] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchBook(parseInt(id));
    }
  }, [id]);

  const fetchBook = async (bookId: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await bookService.getBookById(bookId);
      setBook(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch book details');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!book) return;
    
    try {
      const newFavoriteStatus = !book.is_favorite;
      await bookService.toggleFavorite(book.id, newFavoriteStatus);
      setBook(prev => {
        if (!prev) return null;
        return { ...prev, is_favorite: newFavoriteStatus };
      });
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleShare = () => {
    if (!book) return;
    
    const url = `${window.location.origin}/books/${book.id}`;
    navigator.clipboard.writeText(url);
    alert('Book link copied to clipboard!');
  };

  const handleProgressUpdate = (position: number, completed: boolean) => {
    setBook(prev => {
      if (!prev) return null;
      return { ...prev, current_position: position, is_completed: completed };
    });
  };

  const handleReadBook = () => {
    setReaderMode(true);
  };

  const handleCloseReader = () => {
    setReaderMode(false);
    // Refresh book data to get updated progress
    if (id) {
      fetchBook(parseInt(id));
    }
  };

  const handleEditBook = () => {
    if (book) {
      navigate(`/books/edit/${book.id}`);
    }
  };

  const handleDeleteBook = async () => {
    if (!book) return;
    
    try {
      setDeleteLoading(true);
      await bookService.deleteBook(book.id);
      setDeleteDialogOpen(false);
      navigate('/books');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete book');
      console.error('Error deleting book:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Back to Books
            </Button>
            <Alert severity="error">{error || 'Book not found'}</Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  // Reader mode (full screen reading experience)
  if (readerMode) {
    return (
      <BookReader
        bookId={book.id}
        title={book.title}
        content={book.content}
        currentPosition={book.current_position}
        isCompleted={book.is_completed}
        onNavigateBack={handleCloseReader}
        onProgressUpdate={handleProgressUpdate}
      />
    );
  }

  // Progress calculation
  const progress = book.current_position || 0;

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate(-1)}
            >
              Back to Books
            </Button>

            {isAdmin && (
              <Box>
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={handleEditBook}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              sx={{ mb: 4 }}
            >
              {/* Book Cover */}
              <Box 
                sx={{ 
                  width: { xs: '100%', md: 300 },
                  height: { xs: 300, md: 400 },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src={book.cover_image || 'https://via.placeholder.com/300x400?text=No+Cover'}
                  alt={book.title}
                  sx={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>

              {/* Book Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                  {book.is_completed && (
                    <Chip 
                      label="Completed" 
                      color="success" 
                      icon={<CheckCircleIcon />} 
                    />
                  )}
                  {!book.is_completed && book.current_position && book.current_position > 0 && (
                    <Chip 
                      label={`Progress: ${Math.round(book.current_position)}%`} 
                      color="primary" 
                      icon={<BookmarkIcon />} 
                    />
                  )}
                  {book.is_favorite && (
                    <Chip 
                      label="Favorite" 
                      color="secondary" 
                      icon={<FavoriteIcon />} 
                    />
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body1" paragraph>
                  {book.description}
                </Typography>
                
                <Box sx={{ display: 'flex', mt: 3, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    onClick={handleReadBook}
                  >
                    {progress > 0 && !book.is_completed ? 'Continue Reading' : 'Read Book'}
                  </Button>
                  
                  <IconButton 
                    onClick={handleToggleFavorite}
                    color={book.is_favorite ? "error" : "default"}
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    {book.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  
                  <IconButton 
                    onClick={handleShare}
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Preview Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Preview
            </Typography>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                borderLeft: 4, 
                borderColor: 'primary.main',
                maxHeight: 300,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {book.content.substring(0, 500)}...
              </Typography>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: 80, 
                  background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1))',
                  pointerEvents: 'none',
                }}
              />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleReadBook}
              >
                Read Full Book
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{book?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteBook} 
            color="error" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default BookDetailPage; 