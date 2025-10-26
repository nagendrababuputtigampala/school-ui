import React, { useState } from 'react';
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
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { SchoolData } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface SimpleNavProps {
  schoolData?: SchoolData;
}

const baseNavigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'staff', label: 'Staff Directory' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'contact', label: 'Contact' },
];

export function SimpleNav({ schoolData }: SimpleNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { schoolId } = useParams<{ schoolId: string }>();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  // Add admin to navigation items only if user is authenticated
  const navigationItems = user 
    ? [...baseNavigationItems, { id: 'admin', label: 'Admin' }]
    : baseNavigationItems;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (page: string) => {
    const path = page === 'home' ? '' : page;
    navigate(`/school/${schoolId}/${path}`);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
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
      navigate(`/school/${schoolId}/home`);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };  // Determine active navigation item based on current path
  const getActiveItem = () => {
    const pathSegments = location.pathname.split('/');
    const currentPage = pathSegments[pathSegments.length - 1];
    
    // Handle home page (empty path or 'home')
    if (!currentPage || currentPage === schoolId || currentPage === 'home') {
      return 'home';
    }
    
    return currentPage;
  };

  const activeItem = getActiveItem();
  const schoolName = schoolData?.name || 'School Management System';
  const schoolLogo = (schoolData as any)?.schoolInfo?.logo || (schoolData as any)?.logo;

  const drawer = (
    <Box sx={{ width: 250, backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ 
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.id)}
              selected={activeItem === item.id}
              sx={{
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
                    fontWeight: activeItem === item.id ? 700 : 400,
                    fontSize: activeItem === item.id ? '1.05rem' : '1rem',
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
          ) : (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogin} 
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  mx: 1,
                  borderRadius: 1,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                <LoginIcon sx={{ mr: 2 }} />
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          )}
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      <MuiAppBar position="sticky">
        <Toolbar>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexGrow: 1 }}>
          {schoolLogo ? (
            <>
              <Box
                component="img"
                src={schoolLogo}
                alt={`${schoolName} Logo`}
                onError={(e) => {
                  console.log('Logo failed to load in SimpleNav:', schoolLogo);
                  // Could set a state to hide logo on error, but for simplicity just log
                }}
                sx={{
                  height: { xs: 40, md: 48 },
                  width: 'auto',
                  maxWidth: { xs: 120, md: 150 },
                  objectFit: 'contain',
                  padding: 0,
                  margin: 0,
                  display: 'block',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  display: { xs: 'none', sm: 'block' },
                  marginLeft: 0.5
                }}
              >
                {schoolName}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {schoolName}
            </Typography>
          )}
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {navigationItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <Button
                  key={item.id}
                  color="inherit"
                  onClick={() => handleNavigation(item.id)}
                  sx={{
                    position: 'relative',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive 
                        ? 'rgba(255, 255, 255, 0.25)' 
                        : 'rgba(255, 255, 255, 0.1)',
                    },
                    '&::after': isActive ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                      height: '2px',
                      backgroundColor: 'white',
                      borderRadius: '1px',
                    } : {},
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}

            {/* Authentication UI for Desktop */}
            <Box sx={{ ml: 2 }}>
              {user ? (
                <>
                  <Box
                    sx={{
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
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, display: { xs: 'none', lg: 'block' } }}>
                      {user.email?.split('@')[0]}
                    </Typography>
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
              ) : (
                <Button
                  color="inherit"
                  onClick={handleLogin}
                  startIcon={<LoginIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white',
                    },
                  }}
                  variant="outlined"
                >
                  Login
                </Button>
              )}
            </Box>
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
  </>
  );
}