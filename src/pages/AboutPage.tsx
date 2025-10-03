import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Star,
  Lightbulb,
  People,
  Psychology,
} from '@mui/icons-material';

export function AboutPage() {
  // Ensure no horizontal scroll on any screen size
  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);
  
  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in all aspects of education.',
      icon: Star,
      color: '#f57c00',
    },
    {
      title: 'Innovation',
      description: 'Embracing new technologies and teaching methodologies.',
      icon: Lightbulb,
      color: '#1976d2',
    },
    {
      title: 'Community',
      description: 'Building strong relationships within our school community.',
      icon: People,
      color: '#388e3c',
    },
    {
      title: 'Growth',
      description: 'Fostering continuous learning and personal development.',
      icon: Psychology,
      color: '#7b1fa2',
    },
  ];

  const stats = [
    { label: 'Years of Excellence', value: '35+', progress: 90 },
    { label: 'Graduation Rate', value: '98%', progress: 98 },
    { label: 'College Acceptance', value: '95%', progress: 95 },
    { label: 'Student Satisfaction', value: '97%', progress: 97 },
  ];


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
        '& .MuiContainer-root': {
          paddingLeft: '4px !important',
          paddingRight: '4px !important'
        },
        '& .MuiGrid-container': {
          margin: '0 !important',
          width: '100% !important'
        }
      }
    }}>    
      <Container 
        maxWidth="lg" 
        disableGutters={true}
        sx={{ 
          overflowX: 'hidden',
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, px: { xs: 1, sm: 0 } }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            About EduConnect
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            For over three decades, EduConnect has been at the forefront of educational excellence, 
            nurturing young minds and preparing them for a bright future in an ever-evolving world.
          </Typography>
        </Box>

        {/* Mission and Vision */}
        <Grid 
          container 
          spacing={{ xs: 3, md: 4 }} 
          sx={{ 
            mb: { xs: 6, md: 8 },
            mx: 0,
            width: '100%'
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', p: 3 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  color="primary"
                  sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  Our Mission
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  To provide exceptional education that empowers students to become critical thinkers, 
                  compassionate leaders, and lifelong learners who contribute meaningfully to society. 
                  We are committed to fostering an inclusive environment where every student can 
                  discover their potential and pursue their passions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ 
              height: '100%', 
              p: { xs: 2, md: 3 },
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  color="primary"
                  sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  Our Vision
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  To be recognized as a leading educational institution that shapes the future by 
                  nurturing innovative, ethical, and globally-minded individuals. We envision a 
                  world where our graduates make positive impacts in their communities and beyond, 
                  driving progress and positive change.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Core Values */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
          >
            Our Core Values
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ 
              mb: { xs: 4, md: 6 }, 
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 2, md: 0 }
            }}
          >
            The fundamental principles that guide everything we do
          </Typography>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              mx: 0,
              width: '100%',
              '& .MuiGrid-item': {
                maxWidth: '100%'
              }
            }}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }} key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: { xs: 2, sm: 2.5, md: 3 },
                      height: '100%',
                      transition: 'transform 0.2s',
                      width: '100%',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                      '&:hover': {
                        transform: { xs: 'none', md: 'translateY(-4px)' },
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: value.color,
                        width: { xs: 48, sm: 56, md: 64 },
                        height: { xs: 48, sm: 56, md: 64 },
                        mx: 'auto',
                        mb: { xs: 1.5, md: 2 },
                      }}
                    >
                      <IconComponent sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
                    >
                      {value.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                    >
                      {value.description}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Statistics */}
        <Paper sx={{ 
          p: { xs: 3, md: 4 }, 
          mb: { xs: 6, md: 8 }, 
          backgroundColor: 'primary.main', 
          color: 'primary.contrastText',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Our Track Record
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ 
              mb: { xs: 4, md: 6 }, 
              maxWidth: '600px', 
              mx: 'auto', 
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 2, md: 0 }
            }}
          >
            Numbers that reflect our commitment to excellence
          </Typography>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              mx: 0,
              width: '100%'
            }}
          >
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      opacity: 0.9,
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'white',
                      },
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

       

        {/* Call to Action */}
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Join Our Community
          </Typography>
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto', 
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 2, md: 0 }
            }}
          >
            Become part of a legacy of excellence. Discover how EduConnect can help 
            your child reach their full potential and prepare for a successful future.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center', 
            gap: { xs: 1, sm: 2 }, 
            mt: { xs: 3, md: 4 },
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Chip
              label="Quality Education"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: { xs: '0.8rem', md: '0.875rem' }
              }}
            />
            <Chip
              label="Experienced Faculty"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: { xs: '0.8rem', md: '0.875rem' }
              }}
            />
            <Chip
              label="Modern Facilities"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: { xs: '0.8rem', md: '0.875rem' }
              }}
            />
            <Chip
              label="Holistic Development"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: { xs: '0.8rem', md: '0.875rem' }
              }}
            />
          </Box>
        </Paper>
        </Box>
      </Container>
    </Box>
  );
}