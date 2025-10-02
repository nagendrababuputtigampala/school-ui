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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });

  const contactInfo = [
    {
      title: 'Address',
      content: '123 Education Street\nLearning City, LC 12345',
      icon: LocationOn,
      color: '#1976d2',
    },
    {
      title: 'Phone',
      content: '(555) 123-4567\n(555) 123-4568',
      icon: Phone,
      color: '#388e3c',
    },
    {
      title: 'Email',
      content: 'info@educonnect.edu\nadmissions@educonnect.edu',
      icon: Email,
      color: '#f57c00',
    },
    {
      title: 'Office Hours',
      content: 'Mon-Fri: 8:00 AM - 5:00 PM\nSat: 9:00 AM - 2:00 PM',
      icon: AccessTime,
      color: '#7b1fa2',
    },
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    enqueueSnackbar('Thank you for your message! We will get back to you soon.', { variant: 'success' });
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: '',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            We'd love to hear from you! Whether you have questions about admissions, 
            academics, or want to schedule a visit, our team is here to help.
          </Typography>
        </Box>

        {/* Contact Information Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <Grid size={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: info.color,
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <IconComponent />
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: 'pre-line' }}
                  >
                    {info.content}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid size={6}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Send us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={12} >
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <Email sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <Help sx={{ color: 'text.secondary', mr: 1 }} />,
                      }}
                    >
                      {categories.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={4}
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your inquiry..."
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  sx={{ mt: 3, px: 4 }}
                >
                  Send Message
                </Button>
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Response Time:</strong> We typically respond to inquiries within 24-48 hours during business days.
                </Typography>
              </Alert>
            </Card>
          </Grid>

          {/* Department Directory */}
          <Grid size={6} >
            <Card sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Department Directory
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Contact specific departments directly for specialized assistance.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {departments.map((dept, index) => (
                  <Paper key={index} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                      {dept.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {dept.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {dept.email}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Card>

          
          </Grid>
        </Grid>

        {/* Map Section */}
        <Paper sx={{ p: 4, mt: 6, textAlign: 'center', backgroundColor: 'grey.50' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Visit Our Campus
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '600px', mx: 'auto' }}>
            Schedule a campus tour to experience our facilities firsthand. Our beautiful campus 
            features modern classrooms, state-of-the-art laboratories, sports facilities, and more.
          </Typography>
          
          {/* Placeholder for map */}
          <Box
            sx={{
              height: 300,
              backgroundColor: 'grey.200',
              border: '2px dashed',
              borderColor: 'grey.400',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              mt: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
              <LocationOn sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6">Interactive Campus Map</Typography>
              <Typography variant="body2">
                123 Education Street, Learning City, LC 12345
              </Typography>
            </Box>
          </Box>
          
          <Button variant="outlined" size="large" sx={{ mt: 3 }}>
            Schedule Campus Tour
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}