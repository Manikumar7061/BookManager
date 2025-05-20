import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm';
import Layout from '../../components/layout/Layout';

const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Join Scoof Kindle
          </Typography>
          <RegisterForm />
        </Box>
      </Container>
    </Layout>
  );
};

export default RegisterPage; 