import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Scoof Kindle
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Built with '}
          <Link color="inherit" href="https://reactjs.org/">
            React
          </Link>{' '}
          {' and '}
          <Link color="inherit" href="https://nodejs.org/">
            Node.js
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 