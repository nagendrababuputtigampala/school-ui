import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  People,
  School,
  EmojiEvents,
  ArrowForward,
} from '@mui/icons-material'

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
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

  const stats = [
    { label: 'Students', value: '2,500+', icon: People, color: '#1976d2' },
    { label: 'Teachers', value: '150+', icon: School, color: '#388e3c' },
    { label: 'Awards', value: '50+', icon: EmojiEvents, color: '#f57c00' },
    { label: 'Years', value: '35+', icon: TrendingUp, color: '#7b1fa2' },
  ];

  const highlights = [
    {
      title: 'Academic Excellence',
      description: 'Consistently ranked among the top educational institutions with outstanding academic performance.',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBzdHVkZW50c3xlbnwxfHx8fDE3NTkzMTU0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Innovation & Technology',
      description: 'State-of-the-art facilities and cutting-edge technology integrated into our curriculum.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMHNjaG9vbHxlbnwxfHx8fDE3NTkzMTU0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Sports & Activities',
      description: 'Comprehensive sports programs and extracurricular activities for holistic development.',
      image: 'https://images.unsplash.com/photo-1611195974226-ef16728f2939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzcG9ydHMlMjBmaWVsZHxlbnwxfHx8fDE3NTkzMTU0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
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
      // Mobile-specific fixes
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
        maxWidth="xl" 
        disableGutters={true}
        sx={{ 
          overflowX: 'hidden',
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Box sx={{ 
          mb: { xs: 6, sm: 8, md: 12 }
        }}>
        {/* Hero Section */}
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: { xs: 4, sm: 6, md: 8 },
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(https://images.unsplash.com/photo-1523050854058-8df90110c9d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTkyOTk2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
            minHeight: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
            display: 'flex',
            alignItems: 'center',
            borderRadius: { xs: 0, sm: 1, md: 2 },
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            mx: { xs: 0, sm: 0, md: 0 }
          }}
        >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
          borderRadius: 2,
        }}
      />
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%',
          maxWidth: { xs: '100%', md: '1200px' },
          mx: 'auto',
          px: { xs: 1, sm: 3, md: 4, lg: 6 }
        }}
      >
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
          <Grid size={12}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Welcome to EduConnect
            </Typography>
            <Typography 
              variant="h5" 
              color="inherit" 
              paragraph 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              Empowering minds, shaping futures. Join our community of learners,
              innovators, and leaders who are making a difference in the world.
            </Typography>
            <Box sx={{ 
              mt: { xs: 2, sm: 3, md: 4 }, 
              display: 'flex', 
              gap: { xs: 1, sm: 1.5, md: 2 }, 
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%',
              maxWidth: { xs: '100%', sm: 'auto' }
            }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => onNavigate('about')}
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                Learn More
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => onNavigate('contact')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'grey.300',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>

        {/* Statistics */}
        <Box sx={{ px: { xs: 1, sm: 0, md: 0 } }}>
          <Grid 
            container 
            spacing={{ xs: 0.5, sm: 1.5, md: 2, lg: 3 }} 
            sx={{ 
              mb: { xs: 4, sm: 6, md: 8 },
              mx: 0,
              width: '100%',
              maxWidth: '100%',
              '& .MuiGrid-item': {
                maxWidth: '100%'
              },
              '& .MuiGrid-root': {
                maxWidth: '100%'
              }
            }}
          >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
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
                      bgcolor: stat.color,
                      width: { xs: 48, md: 56 },
                      height: { xs: 48, md: 56 },
                      mx: 'auto',
                      mb: { xs: 1, md: 2 },
                    }}
                  >
                    <IconComponent />
                  </Avatar>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Highlights */}
        <Box sx={{ 
          mb: { xs: 4, sm: 6, md: 8 },
          width: '100%',
          maxWidth: '100%',
          px: { xs: 1, sm: 0, md: 0 }
        }}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Why Choose EduConnect?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ 
              mb: { xs: 3, sm: 4, md: 6 }, 
              maxWidth: { xs: '100%', md: '800px' }, 
              mx: 'auto',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' },
              px: { xs: 1, sm: 3, md: 4 }
            }}
          >
            Discover what makes our educational institution stand out from the rest
          </Typography>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 2.5, md: 3, lg: 4 }}
            sx={{
              mx: 0,
              width: '100%',
              maxWidth: '100%',
              '& .MuiGrid-item': {
                maxWidth: '100%'
              }
            }}
          >
            {highlights.map((highlight, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-4px)' },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={highlight.image}
                    alt={highlight.title}
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      height: { xs: 180, sm: 200, md: 220 }
                    }}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1,
                    p: { xs: 2, sm: 2.5, md: 3 },
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {highlight.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {highlight.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Updates & Announcements */}
        <Box sx={{ px: { xs: 1, sm: 0, md: 0 } }}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3, md: 4, lg: 5 }, 
            backgroundColor: 'grey.50',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            borderRadius: { xs: 1, md: 2 }
          }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: { xs: 3, md: 4 },
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 0 }
          }}>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
            >
              Latest Updates & Announcements
            </Typography>
            <Button
              variant="outlined"
              onClick={() => onNavigate('announcements')}
              endIcon={<ArrowForward />}
              size="medium"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              View All Announcements
            </Button>
          </Box>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 2.5, md: 3 }}
            sx={{
              mx: 0,
              width: '100%',
              maxWidth: '100%',
              '& .MuiGrid-item': {
                maxWidth: '100%'
              }
            }}
          >
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
              <Card sx={{ 
                border: '2px solid', 
                borderColor: 'primary.main', 
                borderRadius: { xs: 1, md: 2 },
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                <CardContent sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        mr: 1,
                      }}
                    />
                    <Typography variant="h6" component="h3">
                      Annual Day Celebration - March 20
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Join us for our spectacular Annual Day celebration featuring student performances,
                    cultural programs, and award ceremonies. All families are invited!
                  </Typography>
                  <Chip label="Event" size="small" color="primary" />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
              <Card sx={{
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                borderRadius: { xs: 1, md: 2 }
              }}>
                <CardContent sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    New Gallery Updates
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Check out the latest photos and videos from our recent science fair,
                    basketball championship, and student activities in our gallery section.
                  </Typography>
                  <Button
                    onClick={() => onNavigate('gallery')}
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowForward />}
                  >
                    View Gallery
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </Paper>
        </Box>
        </Box>
        </Box>
      </Container>
    </Box>
  );
}