import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  People,
  School,
  EmojiEvents,
  ArrowForward,
} from '@mui/icons-material'
import { fetchHomePageData, fetchHeroImages, fetchTimelineMilestones, TimelineMilestone } from '../config/firebase';
import { HeroCarousel } from '../components/HeroCarousel';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const theme = useTheme();
  const isWebScreen = useMediaQuery(theme.breakpoints.up('md')); // md and above (≥960px) considered as web
  
  const [homePageData, setHomePageData] = useState<Map<string, string> | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [timelineMilestones, setTimelineMilestones] = useState<TimelineMilestone[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch homepage data from Firebase
  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        const [data, images, timeline] = await Promise.all([
          fetchHomePageData(),
          fetchHeroImages(),
          fetchTimelineMilestones()
        ]);
        setHomePageData(data);
        setHeroImages(images);
        setTimelineMilestones(timeline);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  // Helper function to get data from the map with fallback
  const getDataValue = (key: string, fallback: string): string => {
    return homePageData?.get(key) || fallback;
  };

  // Helper functions for milestone expansion
  const toggleMilestoneExpansion = (index: number) => {
    setExpandedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isMilestoneExpanded = (index: number) => {
    return expandedMilestones.has(index);
  };

  // Helper function to truncate text based on screen size
  const getTruncatedText = (text: string, isWeb: boolean = false) => {
    const maxLength = isWeb ? 300 : 150;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Ensure no horizontal scroll on any screen size
  useEffect(() => {
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

  // Show loading state while fetching data
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // Use Firebase timeline data with fallback to default milestones
  const defaultMilestones: TimelineMilestone[] = [
    { year: '1985', title: 'School Founded', description: 'EduConnect was established with a vision to provide quality education.' },
    { year: '1990', title: 'First Graduation Class', description: 'Our first batch of 50 students graduated with honors.' },
    { year: '2000', title: 'Technology Integration', description: 'Introduced computer labs and digital learning resources.' },
    { year: '2010', title: 'Campus Expansion', description: 'Added new buildings including science labs and sports complex.' },
    { year: '2020', title: 'Digital Transformation', description: 'Successfully transitioned to hybrid learning during the pandemic.' },
    { year: '2024', title: 'Innovation Hub', description: 'Launched our state-of-the-art innovation and research center.' },
  ];

  const milestones = timelineMilestones.length > 0 ? timelineMilestones : defaultMilestones;

  const stats = [
    { label: 'Students', value: getDataValue('studentsCount', '2,500+'), icon: People, color: '#1976d2' },
    { label: 'Teachers', value: getDataValue('teachersCount', '150+'), icon: School, color: '#388e3c' },
    { label: 'Awards', value: getDataValue('awardsCount', '50+'), icon: EmojiEvents, color: '#f57c00' },
    { label: 'Years', value: getDataValue('yearsCount', '35+'), icon: TrendingUp, color: '#7b1fa2' },
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
        <HeroCarousel
          images={heroImages}
          welcomeTitle={getDataValue('welcomeTitle', 'Welcome to EduConnect')}
          welcomeSubtitle={getDataValue('welcomeSubtitle', 'Empowering minds, shaping futures. Join our community of learners, innovators, and leaders who are making a difference in the world.')}
          onNavigate={onNavigate}
        />

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

     {/* History Timeline */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography 
            variant="h3" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
          >
            Our Journey
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
            Key milestones in our educational journey
          </Typography>
          <Grid 
            container 
            spacing={{ xs: 2, md: 3 }}
            sx={{
              mx: 0,
              width: '100%'
            }}
          >
            {milestones.map((milestone, index) => {
              const isExpanded = isMilestoneExpanded(index);
              const maxLength = isWebScreen ? 300 : 150;
              const shouldShowReadMore = milestone.description.length > maxLength;
              const displayText = isExpanded ? milestone.description : getTruncatedText(milestone.description, isWebScreen);
              
              return (
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
                  <Box sx={{ 
                    mr: { xs: 0, sm: 3 }, 
                    mb: { xs: 2, sm: 0 },
                    flexShrink: 0,
                    textAlign: { xs: 'center', sm: 'left' }
                  }}>
                    <Chip
                      label={milestone.year}
                      color="primary"
                      sx={{ 
                        fontWeight: 'bold', 
                        fontSize: { xs: '0.8rem', md: '0.9rem' }
                      }}
                    />
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                    >
                      {milestone.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        mb: shouldShowReadMore ? 1 : 0,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: isExpanded ? 'none' : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: isExpanded ? 'visible' : 'hidden',
                        textOverflow: isExpanded ? 'clip' : 'ellipsis'
                      }}
                    >
                      {displayText}
                    </Typography>
                    {shouldShowReadMore && (
                      <Button
                        size="small"
                        onClick={() => toggleMilestoneExpansion(index)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 'medium',
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                          p: 0,
                          minWidth: 'auto',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
            })}
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