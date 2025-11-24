import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { createUserProfile } from '../config/userManagement';

export function ProfileSetup() {
  const { user, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('No user found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create basic user profile - admin will need to grant school access
      await createUserProfile(user.uid, {
        email: user.email || '',
        name: formData.name,
        role: 'admin',
        schoolIds: [], // Empty initially - admin will grant access
        isActive: false, // Inactive until admin approves
      });

      await refreshUserProfile();
      setSuccess(true);
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
          >
            <SecurityIcon
              sx={{
                fontSize: 64,
                color: 'success.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Profile Created
            </Typography>
            <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="body2">
                Your profile has been created successfully. An administrator needs to:
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Activate your account</li>
                <li>Grant you access to specific schools</li>
              </ul>
              <Typography variant="body2">
                You'll receive an email notification once your access is approved.
              </Typography>
            </Alert>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/login'}
              sx={{ mt: 3 }}
            >
              Back to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SecurityIcon
              sx={{
                fontSize: 64,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Complete Profile Setup
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please provide your information to complete your profile setup
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              value={formData.email}
              disabled={true}
              helperText="Email address from your account"
              sx={{ mb: 3 }}
            />

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                After creating your profile, an administrator will need to activate your account 
                and grant you access to specific schools.
              </Typography>
            </Alert>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !formData.name.trim()}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Profile'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}