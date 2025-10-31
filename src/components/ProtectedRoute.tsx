import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { ProfileSetup } from './ProfileSetup';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSchoolAccess?: boolean; // New prop to check school-level access
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSchoolAccess = false 
}) => {
  const { user, userProfile, loading, checkSchoolAccess } = useAuth();
  const location = useLocation();
  const { schoolId } = useParams<{ schoolId: string }>();
  const [schoolAccessLoading, setSchoolAccessLoading] = useState(requireSchoolAccess);
  const [hasSchoolAccess, setHasSchoolAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (requireSchoolAccess && schoolId && user) {
        setSchoolAccessLoading(true);
        try {
          const access = await checkSchoolAccess(schoolId);
          setHasSchoolAccess(access);
        } catch (error) {
          console.error('Error checking school access:', error);
          setHasSchoolAccess(false);
        } finally {
          setSchoolAccessLoading(false);
        }
      } else {
        setSchoolAccessLoading(false);
      }
    };

    if (!loading) {
      checkAccess();
    }
  }, [user, schoolId, requireSchoolAccess, loading, checkSchoolAccess]);

  if (loading || schoolAccessLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          {loading ? 'Checking authentication...' : 'Verifying school access...'}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user profile exists (for new users)
  if (!userProfile && user) {
    return <ProfileSetup />;
  }

  // Check if user is inactive
  if (userProfile && !userProfile.isActive) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Account Pending Approval
          </Typography>
          <Typography variant="body2">
            Your account is currently inactive and pending administrator approval. 
            You'll receive an email notification once your access is approved.
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/login'}
        >
          Back to Login
        </Button>
      </Box>
    );
  }

  // Check school-level access
  if (requireSchoolAccess && !hasSchoolAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body2">
            You don't have permission to access this school's admin panel. 
            {schoolId && ` School ID: ${schoolId}`}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Contact your system administrator if you believe this is an error.
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};