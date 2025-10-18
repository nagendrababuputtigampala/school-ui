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
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { SchoolData } from '../config/firebase';

interface SimpleNavProps {
  schoolData?: SchoolData;
}

const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'staff', label: 'Staff Directory' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'contact', label: 'Contact' },
  { id: 'admin', label: 'Admin' },
];

export function SimpleNav({ schoolData }: SimpleNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { schoolId } = useParams<{ schoolId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (page: string) => {
    const path = page === 'home' ? '' : page;
    navigate(`/school/${schoolId}/${path}`);
    setMobileOpen(false); // Close mobile drawer after navigation
  };

  // Determine active navigation item based on current path
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
          <Box sx={{ display: 'flex', gap: 2 }}>
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