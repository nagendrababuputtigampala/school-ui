import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AppBar } from './components/AppBar';
import { SnackbarProvider } from 'notistack';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { StaffDirectoryPage } from './pages/StaffDirectoryPage';
import { AlumniPage } from './pages/AlumniPage';
import { GalleryPage } from './pages/GalleryPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ContactPage } from './pages/ContactPage';
import { Footer } from './components/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#42a5f5',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'staff':
        return <StaffDirectoryPage />;
      case 'alumni':
        return <AlumniPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar currentPage={currentPage} onNavigate={setCurrentPage} />
          
          <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
            {renderPage()}
          </Box>
          
          <Footer />
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}