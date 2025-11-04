import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllUsers,
  updateUserProfile,
  deactivateUser,
  activateUser,
  UserProfile,
  createUserProfile,
  deleteUserProfile,
} from '../config/userManagement';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

interface UserManagementProps {
  availableSchools: { id: string; name: string }[];
}

export function UserManagement({ availableSchools }: UserManagementProps) {
  const { userProfile } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationSeverity, setConfirmationSeverity] = useState<'success' | 'error'>('success');
  const [countdown, setCountdown] = useState(0);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'admin' as 'admin' | 'super-admin',
    schoolIds: [] as string[],
    schoolInput: '',
    isActive: true,
  });

  // Check if current user is super admin
  const isSuperAdmin = userProfile?.role === 'super-admin';

  useEffect(() => {
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      // This will cleanup any running timers when component unmounts
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: UserProfile) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name || '',
        role: user.role,
        schoolIds: user.schoolIds,
        schoolInput: user.schoolIds.join(', '),
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        name: '',
        role: 'admin',
        schoolIds: [],
        schoolInput: '',
        isActive: true,
      });
    }
    setDialogOpen(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setError('');
  };

  const parseSchoolInput = (input: string): string[] => {
    if (!input.trim()) return [];
    return input
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const generateTemporaryPassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      
      const schoolIds = parseSchoolInput(formData.schoolInput);
      
      if (editingUser) {
        // Update existing user
        await updateUserProfile(editingUser.uid, {
          name: formData.name,
          role: formData.role,
          schoolIds: schoolIds,
          isActive: formData.isActive,
        });
        
        // Reload the users list and close dialog
        await loadUsers();
        handleCloseDialog();
      } else {
        // Create new Firebase Auth user and preserve admin session
        const temporaryPassword = generateTemporaryPassword();
        
        // Store current admin user info before creating new user
        const currentAdmin = auth.currentUser;
        const adminEmail = currentAdmin?.email;
        
        if (!currentAdmin || !adminEmail) {
          setError('Admin session not found. Please refresh and try again.');
          setLoading(false);
          return;
        }

        try {
          // Create Firebase Auth user with temporary password
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            temporaryPassword
          );
          
          // Create user profile in Firestore
          await createUserProfile(userCredential.user.uid, {
            email: formData.email,
            name: formData.name,
            role: formData.role,
            schoolIds: schoolIds,
            isActive: formData.isActive,
            createdBy: userProfile?.uid,
          });
          
          // Send password reset email to the new user
          // The user will receive a Firebase auth action URL that our app can handle
          await sendPasswordResetEmail(auth, formData.email);
          
          // Now sign out the newly created user and restore admin session
          await signOut(auth);
          
          // Show success message and require admin to re-login
          setConfirmationSeverity('success');
          setConfirmationMessage(
            `✅ User created successfully!\n\n` +
            `Account created for: ${formData.email}\n` +
            `Password setup email sent to user.\n\n` +
            `You will be redirected to login in {countdown} seconds.`
          );
          setCountdown(5);
          setConfirmationDialogOpen(true);
          
          // Start countdown timer
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                handleConfirmationOk();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          // Reset form and close dialog
          setFormData({
            email: '',
            name: '',
            role: 'admin',
            schoolIds: [],
            schoolInput: '',
            isActive: true,
          });
          setEditingUser(null);
          setDialogOpen(false);
          
        } catch (error: any) {
          console.error('Error creating user:', error);
          
          // Show error message in dialog
          setConfirmationSeverity('error');
          let errorMessage = 'Failed to create user account. ';
          
          // Handle specific Firebase auth errors
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage += 'An account with this email already exists.';
              break;
            case 'auth/invalid-email':
              errorMessage += 'Please enter a valid email address.';
              break;
            case 'auth/weak-password':
              errorMessage += 'Password should be at least 6 characters long.';
              break;
            default:
              errorMessage += 'Please try again.';
          }
          
          setConfirmationMessage(errorMessage + '\n\nYou will be redirected to login again.');
          setCountdown(0); // No countdown for errors
          setConfirmationDialogOpen(true);
          setLoading(false);
          return;
        }
      }
      
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user');
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: UserProfile) => {
    try {
      if (user.isActive) {
        await deactivateUser(user.uid);
      } else {
        await activateUser(user.uid);
      }
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Failed to update user status');
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    // Prevent deleting the current user
    if (user.uid === userProfile?.uid) {
      setError('You cannot delete your own account');
      return;
    }

    // Open confirmation dialog
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // Delete user profile from Firestore
      await deleteUserProfile(userToDelete.uid);
      await loadUsers();
      setError(''); // Clear any previous errors
      
      // Close dialog
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // Show detailed success message with snackbar
      enqueueSnackbar(
        `✅ User profile deleted successfully! Profile for "${userToDelete.email}" has been removed from the system.`,
        { 
          variant: 'success',
          autoHideDuration: 6000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        }
      );
      
      // Show additional information about Firebase Console steps
      setTimeout(() => {
        enqueueSnackbar(
          `⚠️ Next step: Manually delete Firebase Auth account for ${userToDelete.email} from Firebase Console → Authentication → Users`,
          { 
            variant: 'warning',
            autoHideDuration: 10000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          }
        );
      }, 1000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user profile');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmationOk = () => {
    setConfirmationDialogOpen(false);
    // Redirect to login page
    window.location.href = '/login';
  };

  const getSchoolNames = (schoolIds: string[]) => {
    if (schoolIds.includes('*')) return ['All Schools'];
    return schoolIds.map(id => {
      const school = availableSchools.find(s => s.id === id);
      return school?.name || id;
    });
  };

  if (!isSuperAdmin) {
    return (
      <Alert severity="warning">
        You need super admin privileges to access user management.
      </Alert>
    );
  }

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Schools</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'super-admin' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {getSchoolNames(user.schoolIds).map((schoolName, index) => (
                      <Chip
                        key={index}
                        label={schoolName}
                        size="small"
                        icon={<SchoolIcon />}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.isActive}
                        onChange={() => handleToggleUserStatus(user)}
                        size="small"
                      />
                    }
                    label={user.isActive ? 'Active' : 'Inactive'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(user)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <Tooltip title="⚠️ Deletes profile only. Firebase auth account must be deleted manually from Firebase Console.">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user)}
                        color="error"
                        disabled={user.uid === userProfile?.uid}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={(event, reason) => {
          // Prevent closing on backdrop click or escape key
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          handleCloseDialog();
        }}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {!editingUser && (
            <Alert severity="info" sx={{ mb: 2 }}>
              A password reset email will be sent to the user after account creation. 
              The user will need to set their own password before they can access the system.
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!editingUser}
              fullWidth
            />
            
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'super-admin' })}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="super-admin">Super Admin</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="School Access"
              value={formData.schoolInput}
              onChange={(e) => setFormData({ ...formData, schoolInput: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Enter school IDs or names separated by commas (e.g., school1, school2, school3)"
              helperText="Enter school identifiers separated by commas. Use '*' for access to all schools."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            disabled={
              !formData.email || 
              !formData.schoolInput.trim()
            }
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteUser}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
          ⚠️ Confirm User Deletion
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              IMPORTANT: Partial Deletion Only
            </Typography>
            <Typography variant="body2">
              This action will only remove the user profile from our system. 
              The Firebase Authentication account will remain and must be deleted manually.
            </Typography>
          </Alert>

          {userToDelete && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Delete user: <strong>{userToDelete.email}</strong>
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="success.main" sx={{ mb: 1 }}>
                  ✅ This will:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                  • Remove user profile from the system<br/>
                  • Revoke access to all school admin panels<br/>
                  • Delete user role and permissions
                </Typography>

                <Typography variant="subtitle1" color="error.main" sx={{ mb: 1 }}>
                  ❌ This will NOT:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2, mb: 3 }}>
                  • Delete their Firebase Authentication account<br/>
                  • Remove their login credentials from Firebase
                </Typography>

                <Alert severity="info">
                  <Typography variant="subtitle2" gutterBottom>
                    To complete the deletion:
                  </Typography>
                  <Typography variant="body2">
                    1. Go to Firebase Console → Authentication → Users<br/>
                    2. Search for: <strong>{userToDelete.email}</strong><br/>
                    3. Delete the authentication account manually<br/>
                    4. UID reference: <code>{userToDelete.uid}</code>
                  </Typography>
                </Alert>
              </Box>
            </Box>
          )}

          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Are you sure you want to continue with profile deletion?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={cancelDeleteUser}
            variant="outlined"
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteUser}
            variant="contained"
            color="error"
            size="large"
            sx={{ ml: 2 }}
          >
            Delete Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialogOpen}
        onClose={handleConfirmationOk}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: confirmationSeverity === 'success' ? 'success.main' : 'error.main', 
          fontWeight: 'bold' 
        }}>
          {confirmationSeverity === 'success' ? '✅ Success' : '❌ Error'}
        </DialogTitle>
        <DialogContent>
          <Alert severity={confirmationSeverity} sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {confirmationMessage.replace('{countdown}', countdown.toString())}
            </Typography>
          </Alert>
          {confirmationSeverity === 'success' && countdown > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
              <CircularProgress 
                variant="determinate" 
                value={(5 - countdown) * 20} 
                size={40}
                sx={{ mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Auto-redirecting in {countdown} seconds...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {confirmationSeverity === 'success' && countdown > 0 ? (
            <Button
              onClick={handleConfirmationOk}
              variant="outlined"
              fullWidth
              size="large"
            >
              Login Now (Skip Wait)
            </Button>
          ) : (
            <Button
              onClick={handleConfirmationOk}
              variant="contained"
              color={confirmationSeverity === 'success' ? 'success' : 'primary'}
              fullWidth
              size="large"
            >
              {confirmationSeverity === 'success' ? 'Go to Login' : 'OK'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}