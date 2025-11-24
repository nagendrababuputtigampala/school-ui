import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Close as CloseIcon, 
  AccountCircle,
  Logout as LogoutIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { fetchSchoolData } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ChangePasswordDialog } from './ChangePasswordDialog';

interface AppBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const baseNavigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'staff', label: 'Staff Directory' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'contact', label: 'Contact Us' },
];

export function AppBar({ currentPage, onNavigate }: AppBarProps) {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('EduConnect');
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Add admin to navigation items only if user is authenticated
  const navigationItems = user 
    ? [...baseNavigationItems, { id: 'admin', label: 'Admin' }]
    : baseNavigationItems;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (page: string) => {
    if (page === 'admin') {
      // Navigate to the school-specific admin route
      navigate(`/school/${schoolId}/admin`);
    } else {
      onNavigate(page);
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      // Navigate back to home after logout
      onNavigate('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
    handleUserMenuClose();
  };  // Load site name and logo from Firestore on mount
  useEffect(() => {
    if (!schoolId) return;
    
    let isActive = true;
    fetchSchoolData(schoolId).then((schoolData: any) => {
      if (isActive) {
        console.log('School data:', schoolData); // Debug log
        if (schoolData?.name) setSchoolName(schoolData.name);
        
        // Check multiple possible locations for logo
        const logo = schoolData?.schoolInfo?.logo || schoolData?.logo;
        console.log('Logo found:', logo); // Debug log
        if (logo) {
          setSchoolLogo(logo);
        }
      }
    }).catch((error) => {
      console.error('Error fetching school data:', error);
      // Keep default name if fetch fails
    });
    return () => { isActive = false; };
  }, [schoolId]);

  const drawer = (
    <Box sx={{ width: 250, height: '100%', backgroundColor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 0 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => handleNavigation(item.id)}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 700,
                  borderLeft: `4px solid ${theme.palette.primary.contrastText}`,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: currentPage === item.id ? 700 : 400,
                    fontSize: currentPage === item.id ? '1.05rem' : '1rem',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Authentication section for mobile */}
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          {user ? (
            <>
              <ListItem disablePadding>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    mx: 1,
                    borderRadius: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 36,
                      height: 36,
                    }}
                  >
                    {user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Administrator
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={handleChangePassword} 
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    mx: 1,
                    mt: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <SecurityIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Change Password" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={handleLogout} 
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    mx: 1,
                    mt: 1,
                    borderRadius: 1,
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.lighter',
                    }
                  }}
                >
                  <LogoutIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          ) : null}
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      <MuiAppBar position="sticky" elevation={2}>
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {schoolLogo ? (
              <>
                <Box
                  component="img"
                  src={schoolLogo}
                  alt={`${schoolName} Logo`}
                  onError={(e) => {
                    console.log('Logo failed to load:', schoolLogo);
                    setSchoolLogo(null); // Fallback to text if image fails
                  }}
                  sx={{
                    height: { xs: 32, md: 40 },
                    width: 'auto',
                    maxWidth: { xs: 120, md: 150 },
                    objectFit: 'contain',
                  }}
                />
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {schoolName}
                </Typography>
              </>
            ) : (
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
                {schoolName}
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  color="inherit"
                  onClick={() => handleNavigation(item.id)}
                  sx={{
                    backgroundColor: currentPage === item.id ? 'rgba(255,255,255,0.25)' : 'transparent',
                    color: 'white',
                    fontWeight: currentPage === item.id ? 700 : 400,
                    borderBottom: currentPage === item.id ? '3px solid white' : '3px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                    },
                    borderRadius: '4px 4px 0 0',
                    px: 2,
                    minHeight: '40px',
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Authentication UI */}
              {user ? (
                <>
                  <Box
                    sx={{
                      ml: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      padding: '4px 12px',
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      },
                      transition: 'background-color 0.2s',
                    }}
                    onClick={handleUserMenuOpen}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        width: 28,
                        height: 28,
                        fontSize: '0.9rem',
                      }}
                    >
                      {user.email?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                        {user.email?.split('@')[0]}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Admin
                      </Typography>
                    </Box>
                    <AccountCircle sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  </Box>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 220,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {user.email?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {user.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Administrator
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem 
                      onClick={handleChangePassword}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        }
                      }}
                    >
                      <SecurityIcon sx={{ mr: 2 }} />
                      Change Password
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.lighter',
                        }
                      }}
                    >
                      <LogoutIcon sx={{ mr: 2 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : null}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </MuiAppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </>
  );
}