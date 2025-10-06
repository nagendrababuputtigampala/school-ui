import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
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
];

export function SimpleNav({ schoolData }: SimpleNavProps) {
  const navigate = useNavigate();
  const { schoolId } = useParams<{ schoolId: string }>();

  const handleNavigation = (page: string) => {
    const path = page === 'home' ? '' : page;
    navigate(`/school/${schoolId}/${path}`);
  };

  const schoolName = schoolData?.name || 'School Management System';

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {schoolName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              onClick={() => handleNavigation(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}