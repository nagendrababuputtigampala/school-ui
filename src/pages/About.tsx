import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Grid,
  Paper,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  People,
  School,
  EmojiEvents,
  ArrowForward,
  Star,
  Lightbulb,
  Psychology,
} from "@mui/icons-material";

interface About {
  onNavigate: (page: string) => void;
}

export function About({ onNavigate }: About) {
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
  // Stats
  const stats = [
    { label: "Students", value: "2,500+", icon: People, color: "#1976d2" },
    { label: "Teachers", value: "150+", icon: School, color: "#388e3c" },
    { label: "Awards", value: "50+", icon: EmojiEvents, color: "#f57c00" },
    { label: "Years", value: "35+", icon: TrendingUp, color: "#7b1fa2" },
  ];

  // Core Values
  const values = [
    {
      title: "Excellence",
      description: "We strive for the highest standards in all aspects of education.",
      icon: Star,
      color: "#f57c00",
    },
    {
      title: "Innovation",
      description: "Embracing new technologies and teaching methodologies.",
      icon: Lightbulb,
      color: "#1976d2",
    },
    {
      title: "Community",
      description: "Building strong relationships within our school community.",
      icon: People,
      color: "#388e3c",
    },
    {
      title: "Growth",
      description: "Fostering continuous learning and personal development.",
      icon: Psychology,
      color: "#7b1fa2",
    },
  ];

  // Track Record
  const trackStats = [
    { label: "Years of Excellence", value: "35+", progress: 90 },
    { label: "Graduation Rate", value: "98%", progress: 98 },
    { label: "College Acceptance", value: "95%", progress: 95 },
    { label: "Student Satisfaction", value: "97%", progress: 97 },
  ];

  // Journey
  const milestones = [
    {
      year: "1985",
      title: "School Founded",
      description: "EduConnect was established with a vision to provide quality education.",
    },
    {
      year: "1990",
      title: "First Graduation Class",
      description: "Our first batch of 50 students graduated with honors.",
    },
    {
      year: "2000",
      title: "Technology Integration",
      description: "Introduced computer labs and digital learning resources.",
    },
    {
      year: "2010",
      title: "Campus Expansion",
      description: "Added new buildings including science labs and sports complex.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Successfully transitioned to hybrid learning during the pandemic.",
    },
    {
      year: "2024",
      title: "Innovation Hub",
      description: "Launched our state-of-the-art innovation and research center.",
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 12 }}>
        {/* Hero Section */}
        <Paper
          sx={{
            position: "relative",
            backgroundColor: "grey.800",
            color: "#fff",
            mb: 8,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url(https://images.unsplash.com/photo-1523050854058-8df90110c9d1?auto=format&fit=crop&w=1080&q=80)`,
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,.5)",
              borderRadius: 2,
            }}
          />
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
              Welcome to EduConnect
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
              Empowering minds, shaping futures. Join our community of learners,
              innovators, and leaders who are making a difference in the world.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => onNavigate("about")}
            >
              Learn More
            </Button>
          </Container>
        </Paper>

         {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Grid size={2} >
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
                        bgcolor: stat.color,
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <IconComponent />
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
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

        {/* Mission and Vision
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={6}>
        <Grid 
        container 
        spacing={{ xs: 3, md: 4 }} 
        sx={{ 
          mb: { xs: 6, md: 8 },
          mx: 0,
          width: '100%'
        }}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', p: 3 }}>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom color="primary">
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
                <Typography variant="body1" color="text.secondary">
                  To provide exceptional education that empowers students to become critical thinkers, 
                  compassionate leaders, and lifelong learners who contribute meaningfully to society. 
                  We are committed to fostering an inclusive environment where every student can 
                  discover their potential and pursue their passions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={6}>
            <Card sx={{ height: '100%', p: 3 }}>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom color="primary">
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
                <Typography variant="body1" color="text.secondary">
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
        </Grid> */}

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
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}
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
                    <Typography variant="h5" component="h3" gutterBottom
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
                    >
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary"
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
            {trackStats.map((stat, index) => (
              <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    gutterBottom 
                    sx={{ fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ opacity: 0.9, fontSize: { xs: '1rem', md: '1.25rem' } }}>
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

        {/* History Timeline */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom
          sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Our Journey
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: { xs: 4, md: 6 }, 
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 2, md: 0 }
            }}
          >
          Key milestones in our educational journey
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}
            sx={{
              mx: 0,
              width: '100%'
            }}
            >
          {milestones.map((milestone, index) => (
            <Grid size={12} key={index}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  p: { xs: 2, md: 3 },
                  transition: 'transform 0.2s',
                  width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-2px)' },
                  },
                }}
              >
                <Box sx={{ mr: { xs: 0, sm: 3 }, 
                    mb: { xs: 2, sm: 0 },
                    flexShrink: 0,
                    textAlign: { xs: 'center', sm: 'left' }
                  }}>
                  <Chip
                    label={milestone.year}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '0.9rem' }}}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    {milestone.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                  >
                    {milestone.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Updates & Announcements */}
        <Paper sx={{ p: 4, backgroundColor: 'grey.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2">
              Latest Updates & Announcements
            </Typography>
            <Button
              variant="outlined"
              onClick={() => onNavigate('announcements')}
              endIcon={<ArrowForward />}
            >
              View All Announcements
            </Button>
          </Box>
          <Grid container spacing={3}>
            <Grid size={6}>
              <Card sx={{ border: '2px solid', borderColor: 'primary.main', borderRadius: 2 }}>
                <CardContent>
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
            <Grid size={6}>
              <Card>
                <CardContent>
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

        {/* CTA
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            color: "white",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Join Our Community
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: "700px", mx: "auto", mb: 4 }}
          >
            Become part of a legacy of excellence. Discover how EduConnect can
            help your child reach their full potential.
          </Typography>
          <Chip
            label="Quality Education"
            sx={{ mr: 1, backgroundColor: "rgba(255,255,255,0.2)" }}
          />
          <Chip
            label="Experienced Faculty"
            sx={{ mr: 1, backgroundColor: "rgba(255,255,255,0.2)" }}
          />
          <Chip
            label="Holistic Development"
            sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          />
        </Paper> */}
      </Box>
    </Container>
  );
}