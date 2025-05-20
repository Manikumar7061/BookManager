import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../../components/layout/Layout';
import { bookService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    content: ''
  });

  // Fetch book data on component mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setFetchLoading(true);
        const book = await bookService.getBookById(Number(id));
        setFormData({
          title: book.title,
          author: book.author,
          description: book.description,
          coverImage: book.cover_image,
          content: book.content
        });
      } catch (err: any) {
        setError('Failed to fetch book details.');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      setError('Only administrators can edit books.');
    }
  }, [isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setError('Only admin users can edit books.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await bookService.updateBook(Number(id), {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        coverImage: formData.coverImage,
        content: formData.content
      });
      
      setSuccess('Book updated successfully!');
      
      // Navigate to book detail page after 2 seconds
      setTimeout(() => {
        navigate(`/books/${id}`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      setError('Only admin users can delete books.');
      return;
    }

    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      setLoading(true);
      await bookService.deleteBook(Number(id));
      setSuccess('Book deleted successfully!');
      
      // Navigate to books page after 2 seconds
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete book. Please try again.');
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          coverImage: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (fetchLoading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography variant="h4" component="h1" gutterBottom>
            Edit Book
          </Typography>

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ my: 2 }}>
              {success}
            </Alert>
          )}

          {isAdmin ? (
            <>
              <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <TextField
                        name="title"
                        label="Book Title"
                        fullWidth
                        required
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box>
                      <TextField
                        name="author"
                        label="Author"
                        fullWidth
                        required
                        value={formData.author}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box>
                      <TextField
                        name="description"
                        label="Description"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Book Cover Image
                      </Typography>
                      {formData.coverImage && (
                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                          <img 
                            src={formData.coverImage} 
                            alt="Book cover preview" 
                            style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                          />
                        </Box>
                      )}
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                      >
                        Upload Cover Image
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleFileUpload}
                        />
                      </Button>
                      <TextField
                        name="coverImage"
                        label="Or enter image URL"
                        fullWidth
                        value={formData.coverImage}
                        onChange={handleChange}
                        sx={{ mt: 2 }}
                      />
                    </Box>
                    <Box>
                      <TextField
                        name="content"
                        label="Book Content"
                        fullWidth
                        required
                        multiline
                        rows={8}
                        value={formData.content}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Update Book'}
                      </Button>
                      
                      {deleteConfirm ? (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={loading}
                          >
                            Confirm Delete
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setDeleteConfirm(false)}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      ) : (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={handleDelete}
                          disabled={loading}
                        >
                          Delete Book
                        </Button>
                      )}
                    </Box>
                  </Box>
                </form>
              </Paper>
            </>
          ) : (
            <Alert severity="warning" sx={{ mt: 3 }}>
              You need administrator privileges to edit books.
            </Alert>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default EditBookPage; 