import React, { useContext } from 'react';
import { Typography, Box, Button, Container, Stack, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { AuthContext } from '../context/AuthContext';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const HomePage: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    {
      title: 'Extensive Book Library',
      description: 'Access a wide range of books from various genres and authors.',
      icon: <LibraryBooksIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Track Your Reading',
      description: 'Keep track of your reading progress and mark books as completed.',
      icon: <MenuBookIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Save Favorites',
      description: 'Save your favorite books for quick access anytime.',
      icon: <BookmarkIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome {isAuthenticated && user?.name ? `, ${user.name}` : ''}
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            {isAuthenticated 
              ? `${isAdmin ? 'Admin access: Manage' : 'Discover'} your digital book collection.`
              : 'Your Digital Book Library'}
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 600 }}>
            Scoof Kindle provides a seamless reading experience with progress tracking, favorites, and more.
            {isAdmin && isAuthenticated && ' As an admin, you can also add new books to the library.'}
          </Typography>
          {!isAuthenticated && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </Box>
          )}
          {isAuthenticated && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/books')}
                sx={{ mr: 2 }}
              >
                Browse Books
              </Button>
              {isAdmin && (
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/books/add')}
                >
                  Add New Book
                </Button>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Features
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ mb: 4 }}
        >
          {features.map((feature, index) => (
            <Card key={index} sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography gutterBottom variant="h5" component="h3">
                  {feature.title}
                </Typography>
                <Typography variant="body1">{feature.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Layout>
  );
};

export default HomePage; 