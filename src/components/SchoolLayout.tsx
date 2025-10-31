import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Container } from '@mui/material';
import { useSchool } from '../contexts/SchoolContext';
import { ProtectedRoute } from './ProtectedRoute';
import { SimpleNav } from './SimpleNav';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { HomePage } from '../pages/HomePage';
import { AchievementsPage } from '../pages/AchievementsPage';
import { StaffDirectoryPage } from '../pages/StaffDirectoryPage';
import { AlumniPage } from '../pages/AlumniPage';
import { GalleryPage } from '../pages/GalleryPage';
import { AnnouncementsPage } from '../pages/AnnouncementsPage';
import ContactPage from '../pages/ContactPage';
import { AboutPage } from '../pages/AboutPage';
import { AdminPage } from '../pages/AdminPage';

export function SchoolLayout() {
  const { schoolData, loading, error } = useSchool();
  const navigate = useNavigate();
  const { schoolId = 'educonnect' } = useParams<{ schoolId: string }>();
  
  const handleNavigate = (page: string) => {
    navigate(`/school/${schoolId}/${page}`);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !schoolData) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'School not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <SimpleNav schoolData={schoolData} />
      
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/staff" element={<StaffDirectoryPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={
            <ProtectedRoute requireSchoolAccess={true}>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Box>
      
      <Footer />
      <ScrollToTop />
    </>
  );
}