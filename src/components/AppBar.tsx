import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { fetchSchoolData } from '../config/firebase';

interface AppBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'staff', label: 'Staff Directory' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'admin', label: 'Admin' },
];

export function AppBar({ currentPage, onNavigate }: AppBarProps) {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('EduConnect');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  // Load site name from Firestore on mount
  useEffect(() => {
    if (!schoolId) return;
    
    let isActive = true;
    fetchSchoolData(schoolId).then((schoolData: any) => {
      if (isActive && schoolData?.name) setSchoolName(schoolData.name);
    }).catch(() => {
      // Keep default name if fetch fails
    });
    return () => { isActive = false; };
  }, [schoolId]);

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
              selected={currentPage === item.id}
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
                    fontWeight: currentPage === item.id ? 700 : 400,
                    fontSize: currentPage === item.id ? '1.05rem' : '1rem',
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
      <MuiAppBar position="sticky" elevation={2}>
        <Toolbar>
          {/* Logo */}
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
            {schoolName}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  color="inherit"
                  onClick={() => onNavigate(item.id)}
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