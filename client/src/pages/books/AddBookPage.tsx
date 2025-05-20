import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from '../../components/layout/Layout';
import { bookService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    content: ''
  });

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      setError('Only administrators can add books.');
    }
  }, [user, isAdmin]);

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
      setError('Only admin users can add books.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await bookService.addBook({
        title: formData.title,
        author: formData.author,
        description: formData.description,
        coverImage: formData.coverImage,
        content: formData.content
      });
      
      setSuccess('Book added successfully!');
      
      // Reset form after successful submission
      setFormData({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        content: ''
      });

      // Navigate to books page after 2 seconds
      setTimeout(() => {
        navigate('/books');
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back to Books
          </Button>

          <Typography variant="h4" component="h1" gutterBottom>
            Add New Book
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
                        onChange={(e) => {
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
                        }}
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
                      placeholder="Enter the full book content here..."
                    />
                  </Box>
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Add Book'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>
          ) : (
            <Alert severity="warning" sx={{ mt: 3 }}>
              You need administrator privileges to add books. Please contact an administrator for access.
            </Alert>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default AddBookPage; 