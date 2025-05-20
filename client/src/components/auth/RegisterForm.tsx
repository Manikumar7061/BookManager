import React, { useState, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Stack, 
  Alert,
  FormControlLabel,
  Checkbox,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/api';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate admin code if registering as admin
    if (isAdmin && adminCode !== 'admin123') {
      setError('Invalid admin code');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.register(name, email, password, isAdmin ? 'admin' : 'user');
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Create an Account
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Full Name"
            type="text"
            required
            fullWidth
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email Address"
            type="email"
            required
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            required
            fullWidth
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword !== ''}
            helperText={
              password !== confirmPassword && confirmPassword !== '' 
                ? 'Passwords do not match' 
                : ''
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                color="primary"
              />
            }
            label="Register as Administrator"
          />
          
          <Collapse in={isAdmin}>
            <TextField
              label="Admin Code"
              type="password"
              fullWidth
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required={isAdmin}
              error={isAdmin && adminCode === ''}
              helperText={isAdmin && adminCode === '' ? 'Admin code is required' : ''}
              sx={{ mt: 2 }}
            />
          </Collapse>
        </Stack>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            onClick={() => navigate('/login')}
            color="primary"
          >
            Already have an account? Sign in
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterForm; 