import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  TextField,
  Button,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  Person,
} from '@mui/icons-material';
import { fetchContactPageData, ContactUsInfo } from "../config/firebase";
import emailjs from 'emailjs-com';

interface ContactInfo {
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [contactUsData, setContactUsData] = useState<ContactUsInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize EmailJS when component mounts
  useEffect(() => {
    // Debug environment variables
    console.log('EmailJS Environment Variables:', {
      serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
      templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    });

    // Initialize EmailJS only if environment variable is available
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
      console.log('EmailJS initialized successfully with environment variable');
    } else {
      console.error('REACT_APP_EMAILJS_PUBLIC_KEY environment variable is missing');
    }
  }, []);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Email sending function
  const sendEmail = async (): Promise<boolean> => {
    try {
      // Get environment variables
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      console.log('EmailJS Config Check:', {
        serviceId: serviceId ? '✓ Available' : '✗ Missing',
        templateId: templateId ? '✓ Available' : '✗ Missing',
        publicKey: publicKey ? '✓ Available' : '✗ Missing'
      });

      // Validate all required environment variables
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Missing EmailJS environment variables. Please check your .env.local file and restart the server.');
      }

      // Initialize EmailJS with the public key
      emailjs.init(publicKey);

      const templateParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: contactUsData?.email 
          ? (Array.isArray(contactUsData.email) 
            ? contactUsData.email[0] 
            : contactUsData.email)
          : 'info@school.edu',
      };

      console.log('Sending email with params:', templateParams);

      await emailjs.send(
        serviceId,
        templateId,
        templateParams
      );
      
      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await sendEmail();
      
      if (success) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
        setFormErrors({});
      } else {
        setErrorMessage('Failed to send email. Please try again or contact us directly.');
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback contact info if database data isn't available
  const fallbackContactInfo: ContactInfo[] = [
    {
      title: "Address",
      content: "123 Education Street\nLearning City, LC 12345",
      icon: LocationOn,
      color: "#1976d2",
    },
    {
      title: "Phone",
      content: "+1 (555) 123-4567",
      icon: Phone,
      color: "#388e3c",
    },
    {
      title: "Email",
      content: "info@school.edu",
      icon: Email,
      color: "#f57c00",
    },
    {
      title: "Office Hours",
      content: "Monday - Friday: 8:00 AM - 5:00 PM\nSaturday: 9:00 AM - 2:00 PM",
      icon: AccessTime,
      color: "#7b1fa2",
    },
  ];

  useEffect(() => {
    const loadContactData = async () => {
      if (!schoolId) return;

      try {
        const fetchedData = await fetchContactPageData(schoolId);
        if (fetchedData) {
          setContactUsData(fetchedData);
        }
      } catch (error) {
        console.error("Error loading contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, [schoolId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading contact information...</Typography>
        </Box>
      </Container>
    );
  }

  // Prepare contact info data - only show items that have content
  const buildContactInfo = (): ContactInfo[] => {
    if (!contactUsData) {
      return fallbackContactInfo.filter(info => info.content && info.content.trim() !== '');
    }

    const items: ContactInfo[] = [];

    if (contactUsData.address) {
      items.push({
        title: "Address",
        content: contactUsData.address,
        icon: LocationOn,
        color: "#1976d2",
      });
    }

    if (contactUsData.phone) {
      // Handle both string and array for phone
      const phoneContent = Array.isArray(contactUsData.phone) 
        ? contactUsData.phone.join("\n") 
        : contactUsData.phone;
      items.push({
        title: "Phone",
        content: phoneContent,
        icon: Phone,
        color: "#388e3c",
      });
    }

    if (contactUsData.email) {
      // Handle both string and array for email
      const emailContent = Array.isArray(contactUsData.email) 
        ? contactUsData.email.join("\n") 
        : contactUsData.email;
      items.push({
        title: "Email",
        content: emailContent,
        icon: Email,
        color: "#f57c00",
      });
    }

    if (contactUsData.whatsApp) {
      items.push({
        title: "WhatsApp",
        content: contactUsData.whatsApp,
        icon: Person,
        color: "#25d366",
      });
    }

    if (contactUsData.officeHours) {
      // Handle both string and array for office hours
      const officeHoursContent = Array.isArray(contactUsData.officeHours) 
        ? contactUsData.officeHours.join("\n") 
        : contactUsData.officeHours;
      items.push({
        title: "Office Hours",
        content: officeHoursContent,
        icon: AccessTime,
        color: "#7b1fa2",
      });
    }

    return items;
  };

  const contactInfoItems = buildContactInfo();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            maxWidth: "600px",
            mx: "auto",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
          }}
        >
          Get in touch with us. We're here to help and answer any questions you might have.
        </Typography>
      </Box>

      {/* Contact Info Cards */}
      <Box sx={{ px: { xs: 0.5, sm: 0 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(5, 1fr)' 
            },
            gap: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            mb: { xs: 5, md: 8 }
          }}
        >
          {contactInfoItems.map((info, index) => (
            <Box key={index} sx={{ display: "flex" }}>
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
                <Avatar 
                  sx={{
                    bgcolor: info.color, 
                    width: { xs: 46, sm: 52, md: 56 }, 
                    height: { xs: 46, sm: 52, md: 56 }, 
                    mx: "auto", 
                    mb: { xs: 1, sm: 1.5, md: 2 },
                  }}
                >
                  <info.icon
                    fontSize={typeof window !== "undefined" && window.innerWidth < 600 ? "small" : "medium"}
                  />
                </Avatar>
                <Typography 
                  component="h3" 
                  gutterBottom 
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.05rem" }, 
                    fontWeight: 600, 
                    lineHeight: 1.3 
                  }}
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
                    <Link
                      href={
                        contactUsData?.latitude && contactUsData?.longitude
                          ? `https://www.google.com/maps?q=${contactUsData.latitude},${contactUsData.longitude}`
                          : `https://www.google.com/maps?q=${encodeURIComponent(String(info.content).replace(/\n/g, ", "))}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "inherit", textDecoration: "underline" }}
                    >
                      {info.content}
                    </Link>
                  ) : info.title === "Phone" ? (
                    String(info.content).split("\n").map((p: string, i: number) => (
                      <div key={i}>
                        <Link href={`tel:${p.trim()}`} sx={{ color: "inherit", textDecoration: "underline" }}>
                          {p}
                        </Link>
                      </div>
                    ))
                  ) : info.title === "Email" ? (
                    String(info.content).split("\n").map((e: string, i: number) => (
                      <div key={i}>
                        <Link href={`mailto:${e.trim()}`} sx={{ color: "inherit", textDecoration: "underline" }}>
                          {e}
                        </Link>
                      </div>
                    ))
                  ) : info.title === "WhatsApp" ? (
                    <Link
                      href={`https://wa.me/${String(info.content).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "inherit", textDecoration: "underline" }}
                    >
                      {info.content}
                    </Link>
                  ) : (
                    info.content // office hours stay plain text
                  )}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Contact Form and Map Section Side by Side */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
        gap: { xs: 3, lg: 4 },
        mb: 4 
      }}>
        {/* Contact Form */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
            Send us a Message
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
                  disabled={isSubmitting}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={isSubmitting}
                />
              </Box>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                required
                value={formData.subject}
                onChange={handleInputChange('subject')}
                error={!!formErrors.subject}
                helperText={formErrors.subject}
                disabled={isSubmitting}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                multiline
                rows={6}
                required
                value={formData.message}
                onChange={handleInputChange('message')}
                error={!!formErrors.message}
                helperText={formErrors.message}
                disabled={isSubmitting}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                disabled={isSubmitting}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: "25px",
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Map Section */}
        {contactUsData?.latitude && contactUsData?.longitude && (
          <Card sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
              Find Us
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: { xs: "300px", lg: "400px" },
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <iframe
                 src={`https://maps.google.com/maps?q=${contactUsData.latitude},${contactUsData.longitude}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              />
            </Box>
          </Card>
        )}
      </Box>

      {/* Success/Error Notifications */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage;