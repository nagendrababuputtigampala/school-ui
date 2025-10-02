import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* School Info */}
          <Grid size={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              EduConnect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Empowering minds, shaping futures. Excellence in education since 1985.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                sx={{ color: 'primary.contrastText', '&:hover': { opacity: 0.8 } }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'primary.contrastText', '&:hover': { opacity: 0.8 } }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'primary.contrastText', '&:hover': { opacity: 0.8 } }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ color: 'primary.contrastText', '&:hover': { opacity: 0.8 } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                About Us
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Achievements
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Gallery
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Announcements
              </Link>
            </Box>
          </Grid>

          {/* Academic Programs */}
          <Grid size={3}>
            <Typography variant="h6" gutterBottom>
              Programs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Elementary School
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Middle School
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                High School
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                underline="hover"
                sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                Extracurricular
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Education Street<br />
                  Learning City, LC 12345
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  info@educonnect.edu
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 EduConnect. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}