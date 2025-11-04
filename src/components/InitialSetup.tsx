import React, { useState } from 'react';
import { Button, Alert, Box, Typography, Card, CardContent } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';

export function InitialSetup() {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const createInitialUserProfile = async () => {
    if (!user) {
      setMessage('No user is currently logged in');
      return;
    }

    setLoading(true);
    try {
      const userProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Administrator',
        role: 'super-admin',
        schoolIds: ['*'], // Access to all schools
        isActive: true,
        requirePasswordChange: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setMessage('User profile created successfully! Reloading page...');
      
      // Reload the page to refresh the auth context
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      
      if (error.code === 'permission-denied' || error.message.includes('permissions')) {
        setMessage(`Firestore Permission Error: Your Firestore database has restrictive security rules. 

Please go to your Firebase Console:
1. Go to https://console.firebase.google.com
2. Select your project
3. Go to Firestore Database → Rules
4. Replace the rules with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

5. Click 'Publish'
6. Then try again here.`);
      } else {
        setMessage(`Error creating user profile: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Alert severity="warning">
        Please log in to create your initial user profile.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            🚀 Initial Setup Required
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome! It looks like this is your first time accessing the admin panel. 
            You need to create your user profile to continue.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            <strong>Logged in as:</strong> {user.email}
          </Typography>
          
          <Button
            variant="contained"
            onClick={createInitialUserProfile}
            disabled={loading}
            size="large"
            sx={{ mb: 2 }}
          >
            {loading ? 'Creating Profile...' : 'Create Super Admin Profile'}
          </Button>
          
          {message && (
            <Alert 
              severity={message.includes('Error') || message.includes('Permission') ? 'error' : 'success'}
              sx={{ mt: 2 }}
            >
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                {message}
              </pre>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}