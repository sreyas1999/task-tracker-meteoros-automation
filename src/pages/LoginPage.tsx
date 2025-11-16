import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch } from '../redux/hooks';
import { setUserSession } from '../redux/slices/sessionSlice';
import { getDeviceInfo, getGeolocation } from '../utils/userMetadata';
import '../styles/LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Validate email format: must contain @ and a dot after @
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Capture device info
      const deviceInfo = getDeviceInfo();

      // Capture geolocation
      const location = await getGeolocation();

      // Create user session
      const session = {
        email,
        loginTime: new Date().toISOString(),
        deviceInfo,
        location,
      };

      // Store session
      dispatch(setUserSession(session));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h4" component="h1" gutterBottom className="login-title">
          TaskTrackr
        </Typography>
        <Typography variant="body2" color="text.secondary" className="login-subtitle">
          Welcome! Please login to continue
        </Typography>

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            disabled={loading}
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            disabled={loading}
            autoComplete="current-password"
          />

          {error && (
            <Alert severity="error" className="login-alert">
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>

        <Typography variant="caption" color="text.secondary" className="login-note">
          Note: This is a simulated login. Any email and password will work.
        </Typography>
      </Paper>
    </Box>
  );
};
