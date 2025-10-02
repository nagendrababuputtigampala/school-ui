import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Paper,
  Avatar,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  Person,
  Help,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

export function ContactPage() {
  const { enqueueSnackbar } = useSnackbar();
  
  // Ensure no horizontal scroll on any screen size
  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    // Add mobile-specific viewport meta tag handling
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });

  const contactInfo = [
    { title: 'Address', content: '123 Education Street\nLearning City, LC 12345', icon: LocationOn, color: '#1976d2' },
    { title: 'Phone', content: '(555) 123-4567\n(555) 123-4568', icon: Phone, color: '#388e3c' },
    { title: 'Email', content: 'info@educonnect.edu\nadmissions@educonnect.edu', icon: Email, color: '#f57c00' },
    { title: 'Office Hours', content: 'Mon-Fri: 8:00 AM - 5:00 PM\nSat: 9:00 AM - 2:00 PM', icon: AccessTime, color: '#7b1fa2' },
  ];

  const departments = [
    { name: 'Admissions Office', phone: '(555) 123-4570', email: 'admissions@educonnect.edu' },
    { name: 'Academic Affairs', phone: '(555) 123-4571', email: 'academics@educonnect.edu' },
    { name: 'Student Services', phone: '(555) 123-4572', email: 'students@educonnect.edu' },
    { name: 'Athletics Department', phone: '(555) 123-4573', email: 'athletics@educonnect.edu' },
    { name: 'Health Office', phone: '(555) 123-4574', email: 'health@educonnect.edu' },
    { name: 'Transportation', phone: '(555) 123-4575', email: 'transport@educonnect.edu' },
  ];

  const categories = [
    { value: 'admissions', label: 'Admissions Inquiry' },
    { value: 'academics', label: 'Academic Information' },
    { value: 'events', label: 'Events & Programs' },
    { value: 'support', label: 'Student Support' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enqueueSnackbar('Thank you for your message! We will get back to you soon.', { variant: 'success' });
    setFormData({ name: '', email: '', phone: '', subject: '', category: '', message: '' });
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      '@media (max-width: 600px)': {
        '& .MuiContainer-root': { paddingLeft: '4px !important', paddingRight: '4px !important' },
        '& .MuiGrid-container': { margin: '0 !important', width: '100% !important' }
      }
    }}>    
      <Container 
        maxWidth="lg" 
        disableGutters
        sx={{ px: { xs: 0.5, sm: 1, md: 2, lg: 3 }, width: '100%', maxWidth: '100%' }}
      >
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, px: { xs: 1, sm: 0 } }}>
            <Typography component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Typography 
              color="text.secondary" 
              sx={{ maxWidth: '700px', mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' }, px: { xs: 1, md: 0 } }}
            >
              We'd love to hear from you! Whether you have questions about admissions, 
              academics, or want to schedule a visit, our team is here to help.
            </Typography>
          </Box>

          {/* Contact Information Cards */}
          <Box sx={{ px: { xs: 0.5, sm: 0 } }}>
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3, lg: 4 }} sx={{ mb: { xs: 5, md: 8 } }}>
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index} sx={{ display: 'flex' }}>
                    <Card
                      sx={{
                        textAlign: 'center',
                        p: { xs: 1.75, sm: 2.25, md: 3 },
                        height: '100%',
                        transition: 'transform 0.25s, box-shadow 0.25s',
                        width: '100%',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '&:hover': { transform: { xs: 'none', md: 'translateY(-4px)' }, boxShadow: { xs: 1, md: 4 } },
                      }}
                    >
                      <Avatar sx={{ bgcolor: info.color, width: { xs: 46, sm: 52, md: 56 }, height: { xs: 46, sm: 52, md: 56 }, mx: 'auto', mb: { xs: 1, sm: 1.5, md: 2 } }}>
                        <IconComponent fontSize={typeof window !== 'undefined' && window.innerWidth < 600 ? 'small' : 'medium'} />
                      </Avatar>
                      <Typography component="h3" gutterBottom sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' }, fontWeight: 600, lineHeight: 1.3 }}>
                        {info.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }, lineHeight: 1.35 }}>
                        {info.content}
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Grid container spacing={{ xs: 2.5, sm: 3.5, md: 5 }}>
            {/* Contact Form */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                <Typography component="h2" gutterBottom sx={{ fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.9rem' }, fontWeight: 600 }}>
                  Send us a Message
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }, lineHeight: 1.5 }}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2.5 }}>
                  <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    <Grid size={12}>
                      <TextField required fullWidth label="Full Name" name="name" value={formData.name} onChange={handleInputChange} InputProps={{ startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} /> }} />
                    </Grid>
                    <Grid size={12}>
                      <TextField required fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} InputProps={{ startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} /> }} />
                    </Grid>
                    <Grid size={12}>
                      <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} InputProps={{ startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} /> }} />
                    </Grid>
                    <Grid size={12}>
                      <TextField required fullWidth select label="Category" name="category" value={formData.category} onChange={handleInputChange} InputProps={{ startAdornment: <Help sx={{ color: 'text.secondary', mr: 1 }} /> }}>
                        {categories.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={12}>
                      <TextField required fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} />
                    </Grid>
                    <Grid size={12}>
                      <TextField required fullWidth multiline rows={4} label="Message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Please provide details about your inquiry..." />
                    </Grid>
                  </Grid>
                  <Button type="submit" variant="contained" size="large" startIcon={<Send />} fullWidth sx={{ mt: 3, py: { xs: 1, sm: 1.25 }, fontSize: { xs: '0.75rem', sm: '0.8rem' }, fontWeight: 600 }}>
                    Send Message
                  </Button>
                </Box>
                <Alert severity="info" sx={{ mt: 3, p: { xs: 1, sm: 1.5 } }}>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }, lineHeight: 1.4 }}>
                    <strong>Response Time:</strong> We typically respond to inquiries within 24-48 hours during business days.
                  </Typography>
                </Alert>
              </Card>
            </Grid>

            {/* Department Directory */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: { xs: 2.5, sm: 3, md: 4 }, mb: 4 }}>
                <Typography component="h2" gutterBottom sx={{ fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.55rem' }, fontWeight: 600 }}>
                  Department Directory
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }, lineHeight: 1.5 }}>
                  Contact specific departments directly for specialized assistance.
                </Typography>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {departments.map((dept, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                      <Paper sx={{ p: { xs: 1.25, sm: 1.5 }, backgroundColor: 'grey.50', height: '100%' }}>
                        <Typography gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' } }}>
                          {dept.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                          <Phone sx={{ fontSize: 15, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                            {dept.phone}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Email sx={{ fontSize: 15, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                            {dept.email}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* Map Section */}
          <Box sx={{ px: { xs: 0.5, sm: 0 } }}>
            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mt: { xs: 4, md: 6 }, textAlign: 'center', backgroundColor: 'grey.50', width: '100%', boxSizing: 'border-box' }}>
              <Typography component="h2" gutterBottom sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.9rem' }, fontWeight: 600 }}>
                Visit Our Campus
              </Typography>
              <Typography color="text.secondary" paragraph sx={{ maxWidth: '600px', mx: 'auto', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, lineHeight: 1.5 }}>
                Schedule a campus tour to experience our facilities firsthand. Our beautiful campus 
                features modern classrooms, state-of-the-art laboratories, sports facilities, and more.
              </Typography>
              <Box sx={{ height: { xs: 240, sm: 280, md: 300 }, backgroundColor: 'grey.200', border: '2px dashed', borderColor: 'grey.400', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mt: 3 }}>
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <LocationOn sx={{ fontSize: { xs: 40, sm: 44, md: 48 }, mb: 1 }} />
                  <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }, fontWeight: 600 }}>
                    Interactive Campus Map
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                    123 Education Street, Learning City, LC 12345
                  </Typography>
                </Box>
              </Box>
              <Button variant="outlined" size="large" sx={{ mt: 3, fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }, fontWeight: 600 }}>
                Schedule Campus Tour
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}