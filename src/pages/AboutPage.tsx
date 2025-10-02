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
  School,
  EmojiEvents,
  Group,
  TrendingUp,
  Star,
  Lightbulb,
  People,
  Psychology,
} from '@mui/icons-material';

export function AboutPage() {
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

  const milestones = [
    { year: '1985', title: 'School Founded', description: 'EduConnect was established with a vision to provide quality education.' },
    { year: '1990', title: 'First Graduation Class', description: 'Our first batch of 50 students graduated with honors.' },
    { year: '2000', title: 'Technology Integration', description: 'Introduced computer labs and digital learning resources.' },
    { year: '2010', title: 'Campus Expansion', description: 'Added new buildings including science labs and sports complex.' },
    { year: '2020', title: 'Digital Transformation', description: 'Successfully transitioned to hybrid learning during the pandemic.' },
    { year: '2024', title: 'Innovation Hub', description: 'Launched our state-of-the-art innovation and research center.' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            About EduConnect
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            For over three decades, EduConnect has been at the forefront of educational excellence, 
            nurturing young minds and preparing them for a bright future in an ever-evolving world.
          </Typography>
        </Box>

        {/* Mission and Vision */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={6}>
            <Card sx={{ height: '100%', p: 3 }}>
              <CardContent>
                <Typography variant="h4" component="h2" gutterBottom color="primary">
                  Our Mission
                </Typography>
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
                  Our Vision
                </Typography>
                <Typography variant="body1" color="text.secondary">
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
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Our Core Values
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
          >
            The fundamental principles that guide everything we do
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => {
              const IconComponent = value.icon;
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
                        bgcolor: value.color,
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Statistics */}
        <Paper sx={{ p: 4, mb: 8, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Our Track Record
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 6, maxWidth: '600px', mx: 'auto', opacity: 0.9 }}
          >
            Numbers that reflect our commitment to excellence
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
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
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Our Journey
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
          >
            Key milestones in our educational journey
          </Typography>
          <Grid container spacing={3}>
            {milestones.map((milestone, index) => (
              <Grid size={12} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    p: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ mr: 3, flexShrink: 0 }}>
                    <Chip
                      label={milestone.year}
                      color="primary"
                      sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {milestone.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {milestone.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            Join Our Community
          </Typography>
          <Typography variant="h6" paragraph sx={{ maxWidth: '700px', mx: 'auto', opacity: 0.9 }}>
            Become part of a legacy of excellence. Discover how EduConnect can help 
            your child reach their full potential and prepare for a successful future.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Chip
              label="Quality Education"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label="Experienced Faculty"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label="Modern Facilities"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              label="Holistic Development"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}