import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';
import Layout from '../../components/layout/Layout';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to Scoof Kindle
          </Typography>
          <LoginForm />
        </Box>
      </Container>
    </Layout>
  );
};

export default LoginPage; 