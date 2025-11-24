import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../config/firebase';

export function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  
  // Get the action code from URL parameters (handles both /set-password and /__/auth/action URLs)
  const actionCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    // Debug: Log the current URL and parameters
    console.log('Current URL:', window.location.href);
    console.log('Search params:', {
      oobCode: actionCode,
      mode: mode,
      allParams: Object.fromEntries(searchParams.entries())
    });

    const verifyResetCode = async () => {
      if (!actionCode) {
        setError('Invalid or missing password reset link. Please request a new one.');
        setLoading(false);
        return;
      }

      // Check if this is a password reset action (allow undefined mode for direct links)
      if (mode && mode !== 'resetPassword') {
        setError('This link is not for password reset. Please request a new password reset link.');
        setLoading(false);
        return;
      }

      try {
        // Verify the password reset code and get the email
        const userEmail = await verifyPasswordResetCode(auth, actionCode);
        setEmail(userEmail);
        setLoading(false);
      } catch (error: any) {
        console.error('Error verifying reset code:', error);
        switch (error.code) {
          case 'auth/expired-action-code':
            setError('This password reset link has expired. Please request a new one.');
            break;
          case 'auth/invalid-action-code':
            setError('Invalid password reset link. Please request a new one.');
            break;
          case 'auth/user-disabled':
            setError('This user account has been disabled.');
            break;
          case 'auth/user-not-found':
            setError('No user found with this email address.');
            break;
          default:
            setError('Failed to verify password reset link. Please try again.');
        }
        setLoading(false);
      }
    };

    verifyResetCode();
  }, [actionCode, mode, searchParams]);

  useEffect(() => {
    // Validate password requirements
    const isValid = password.length >= 6 && password === confirmPassword;
    setPasswordValid(isValid);
  }, [password, confirmPassword]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValid) {
      setError('Please ensure your password is at least 6 characters and passwords match.');
      return;
    }

    if (!actionCode) {
      setError('Invalid reset code. Please request a new password reset link.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // Confirm the password reset with the new password
      await confirmPasswordReset(auth, actionCode, password);
      
      setSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password set successfully! You can now log in with your new password.',
            email: email 
          }
        });
      }, 3000);

    } catch (error: any) {
      console.error('Error setting password:', error);
      switch (error.code) {
        case 'auth/expired-action-code':
          setError('This password reset link has expired. Please request a new one.');
          break;
        case 'auth/invalid-action-code':
          setError('Invalid password reset link. Please request a new one.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        default:
          setError('Failed to set password. Please try again.');
      }
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying password reset link...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                ✅ Password Set Successfully!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your password has been set successfully. You will be redirected to the login page in a few seconds.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {email}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Go to Login Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Set Your Password
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Welcome! Please set a secure password for your account.
          </Typography>

          {email && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Setting password for: <strong>{email}</strong>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSetPassword}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              helperText="Password must be at least 6 characters long"
              error={password.length > 0 && password.length < 6}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              helperText={
                confirmPassword.length > 0 && password !== confirmPassword
                  ? "Passwords don't match"
                  : ""
              }
              error={confirmPassword.length > 0 && password !== confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!passwordValid || verifying}
            >
              {verifying ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Setting Password...
                </>
              ) : (
                'Set Password'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Password Requirements:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • At least 6 characters long<br/>
              • Both password fields must match<br/>
              • Choose a secure password you can remember
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}