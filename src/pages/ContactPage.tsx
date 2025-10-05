import React, { useEffect, useState } from 'react';
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
  WhatsApp,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { ContactUsInfo, fetchContactUsData } from '../config/firebase';

export function ContactPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [contactUsData, setContactUsData] = useState<ContactUsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch contact us data from Firebase
    useEffect(() => {
      const loadContactUsData = async () => {
        try {
          const [data] = await Promise.all([fetchContactUsData()]);
           console.log("Fetched contact us data:", data); 
          setContactUsData(data);
        } catch (error) {
          console.error('Error loading homepage data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadContactUsData();
    }, []);

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

  const fallbackContactInfo  = [
    { title: 'Address', content: '123 Education Street\nLearning City, LC 12345', icon: LocationOn, color: '#1976d2' },
    { title: 'Phone', content: '(555) 123-4567\n(555) 123-4568', icon: Phone, color: '#388e3c' },
    { title: "WhatsApp", content: '(555) 123-4567', icon: Phone, color: "#25D366"},
    { title: 'Email', content: 'info@educonnect.edu\nadmissions@educonnect.edu', icon: Email, color: '#f57c00' },
    { title: 'Office Hours', content: 'Mon-Fri: 8:00 AM - 5:00 PM\nSat: 9:00 AM - 2:00 PM', icon: AccessTime, color: '#7b1fa2' },
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
        <Box sx={{ py: { xs: 1, sm: 2, md: 2 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, px: { xs: 1, sm: 0 } }}>
            <Typography 
              color="text.secondary" 
              sx={{ maxWidth: '700px', mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' }, px: { xs: 1, md: 0 } }}
            >
              We'd love to hear from you! Whether you have questions about admissions, 
              academics, or want to schedule a visit, our team is here to help.
            </Typography>
          </Box>

          {/* Contact Information Cards */}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : contactUsData ? (
            <Box sx={{ px: { xs: 0.5, sm: 0 } }}>
              <Grid
                container
                spacing={{ xs: 1.5, sm: 2, md: 3, lg: 4 }}
                sx={{ mb: { xs: 5, md: 8 } }}
              >
                {(() => {
                  // Prepare info data (from DB or fallback)
                  const infoData = contactUsData
                    ? [
                        { title: "Address", content: contactUsData.address.replace(/, /g, "\n"), icon: LocationOn, color: "#1976d2" },
                        { title: "Phone", content: contactUsData.phone.join("\n"), icon: Phone, color: "#388e3c" },
                        { title: "Email", content: contactUsData.email.join("\n"), icon: Email, color: "#f57c00" },
                        { title: "WhatsApp", content: contactUsData.whatsApp || "", icon: WhatsApp, color: "#25D366" },
                        { title: "Office Hours", content: contactUsData.officeHours.join("\n"), icon: AccessTime, color: "#7b1fa2" },
                      ]
                    : fallbackContactInfo;

                  return infoData.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <Grid
                        size={{ xs: 6, sm: 6, md: 2.4 }}
                        key={index}
                        sx={{ display: "flex" }}
                      >
                        <Card
                          sx={{
                            textAlign: "center",
                            p: { xs: 1.75, sm: 2.25, md: 3 },
                            height: "100%",
                            transition: "transform 0.25s, box-shadow 0.25s",
                            width: "100%",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            "&:hover": {
                              transform: { xs: "none", md: "translateY(-4px)" },
                              boxShadow: { xs: 1, md: 4 },
                            },
                          }}
                        >
                          <Avatar sx={{bgcolor: info.color, width: { xs: 46, sm: 52, md: 56 }, height: { xs: 46, sm: 52, md: 56 }, mx: "auto", mb: { xs: 1, sm: 1.5, md: 2 },}}
                          >
                            <IconComponent
                              fontSize={typeof window !== "undefined" && window.innerWidth < 600 ? "small" : "medium"}
                            />
                          </Avatar>
                          <Typography component="h3" gutterBottom sx={{fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.05rem",}, fontWeight: 600, lineHeight: 1.3 }}
                          >
                            {info.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              whiteSpace: "pre-line",
                              fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                              lineHeight: 1.35,
                            }}
                          >
                            {info.title === "Address" ? (
                              <a
                                href={contactUsData?.latitude && contactUsData?.longitude
                                      ? `https://www.google.com/maps?q=${contactUsData.latitude},${contactUsData.longitude}`
                                      : `https://www.google.com/maps?q=${encodeURIComponent(info.content.replace(/\n/g, ", "))}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "inherit", textDecoration: "underline" }}
                              >
                                {info.content}
                              </a>
                            ) : info.title === "Phone" ? (
                              info.content.split("\n").map((p, i) => (
                                <div key={i}>
                                  <a href={`tel:${p.trim()}`} style={{ color: "inherit", textDecoration: "underline" }}>
                                    {p}
                                  </a>
                                </div>
                              ))
                            ) : info.title === "Email" ? (
                              info.content.split("\n").map((e, i) => (
                                <div key={i}>
                                  <a href={`mailto:${e.trim()}`} style={{ color: "inherit", textDecoration: "underline" }}>
                                    {e}
                                  </a>
                                </div>
                              ))
                              ) : info.title === "WhatsApp" ? (
                            <a
                              href={`https://wa.me/${info.content.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "inherit", textDecoration: "underline" }}
                            >
                              {info.content}
                            </a>
                            ) : (
                              info.content // office hours stay plain text
                            )}
                          </Typography>

                        </Card>
                      </Grid>
                    );
                  });
                })()}
              </Grid>
            </Box>
          ) : (
            <Typography>No contact info found.</Typography>
          )}

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

          {/* Map Section - Now inside the same Grid container */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'grey.50' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography component="h2" gutterBottom sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.9rem' }, fontWeight: 600 }}>
                  Visit Our Campus
                </Typography>
              </Box>
              
              <Box
                sx={{
                  flexGrow: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  minHeight: { xs: 240, sm: 280, md: 300 },
                  position: 'relative',
                }}
              >
                {contactUsData?.latitude && contactUsData?.longitude ? (
                  <iframe
                    title="Campus Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px', display: 'block' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${contactUsData.latitude},${contactUsData.longitude}&z=15&output=embed`}
                  />
                ) : (
                  <Box
                    sx={{
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.200',
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      Map location not available
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }, color: 'text.secondary' }}>
                  123 Education Street, Learning City, LC 12345
                </Typography>
              </Box>
              <Button variant="outlined" size="large" fullWidth sx={{ mt: 3, fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' }, fontWeight: 600 }}>
                Schedule Campus Tour
              </Button>
            </Paper>
          </Grid>
        </Grid>
        </Box>
      </Container>
    </Box>
  );
}