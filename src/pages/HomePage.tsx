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
  ArrowForward,
  History,
} from '@mui/icons-material'
import { useSchool } from '../contexts/SchoolContext';
import { TimelineMilestone } from '../config/firebase';
import { HeroCarousel } from '../components/HeroCarousel';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const theme = useTheme();
  const isWebScreen = useMediaQuery(theme.breakpoints.up('md')); // md and above (≥960px) considered as web
  const { schoolData, loading } = useSchool();
  
  const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set());
  const [announcements, setAnnouncements] = useState<any[]>([]);

    // Fetch homepage data from Firebase
  useEffect(() => {
    // Data comes from SchoolContext, no need to fetch here
    // Loading is handled by SchoolContext
    
    // Extract announcements from school data
    if (schoolData?.pages?.homePage?.announcementsSection?.recentUpdates) {
      const updates = schoolData.pages.homePage.announcementsSection.recentUpdates;
      // Sort by date (newest first) and take top 2
      const sortedUpdates = updates
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);
      setAnnouncements(sortedUpdates);
    } else {
      setAnnouncements([]);
    }
  }, [schoolData]);

  // Helper function to get data with fallback
  const getData = (key: string, fallback: string = '') => {
    if (!schoolData) return fallback;
    
    switch (key) {
      case 'welcomeTitle':
        return schoolData.welcomeTitle || fallback;
      case 'welcomeSubtitle':
        return schoolData.welcomeSubtitle || fallback;
      case 'studentsCount':
        return schoolData.studentsCount || fallback;
      case 'teachersCount':
        return schoolData.teachersCount || fallback;
      case 'awardsCount':
        return schoolData.awardsCount || fallback;
      case 'yearEstablished':
        return schoolData.yearEstablished || fallback;
      case 'successRate':
        return schoolData.successRate || fallback;
      case 'whyChooseTitle':
        return schoolData.whyChooseTitle || fallback;
      case 'whyChooseSubtitle':
        return schoolData.whyChooseSubtitle || fallback;
      default:
        return fallback;
    }
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


  const milestones = schoolData?.timeline && schoolData.timeline.length > 0 ? schoolData.timeline : [] as TimelineMilestone[];

  const stats = [
    { label: 'Students', value: getData('studentsCount', '2,500+'), icon: People, color: '#1976d2' },
    { label: 'Teachers', value: getData('teachersCount', '150+'), icon: People, color: '#388e3c' },
    { label: 'Established', value: getData('yearEstablished', '1995'), icon: History, color: '#7b1fa2' },
    { label: 'Success Rate', value: getData('successRate', '98%'), icon: TrendingUp, color: '#ff9800' },
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
          images={schoolData?.heroImages || []}
          welcomeTitle={getData('welcomeTitle', 'Welcome to EduConnect')}
          welcomeSubtitle={getData('welcomeSubtitle', 'Empowering minds, shaping futures. Join our community of learners, innovators, and leaders who are making a difference in the world.')}
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

        {/* Principal Section */}
        {schoolData?.pages?.homePage?.principalSection && (
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            
            {/* Second Design - Full Width Compact Version */}
            <Box sx={{ px: 0 }}>
              <Card
                sx={{
                  overflow: 'hidden',
                  borderRadius: 0,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  width: '100%',
                }}
              >
                <Grid container sx={{ minHeight: { xs: 250, md: 300 } }}>
                  {/* Left Side - Principal Info */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: { xs: 3, md: 4 },
                        height: '100%',
                        minHeight: { xs: 250, md: 300 },
                        display: 'flex',
                        flexDirection: { xs: 'row', md: 'column' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: { xs: 'left', md: 'center' },
                        gap: { xs: 3, md: 2 },
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        },
                      }}
                    >
                      <Avatar
                        src={schoolData.pages.homePage.principalSection.image}
                        alt={schoolData.pages.homePage.principalSection.name}
                        sx={{
                          width: { xs: 80, md: 120 },
                          height: { xs: 80, md: 120 },
                          border: '3px solid rgba(255,255,255,0.3)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                          position: 'relative',
                          zIndex: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            fontSize: { xs: '1.2rem', md: '1.4rem' },
                          }}
                        >
                          {schoolData.pages.homePage.principalSection.name}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            opacity: 0.9,
                            fontWeight: 400,
                            letterSpacing: 0.5,
                            fontSize: { xs: '0.9rem', md: '1rem' },
                          }}
                        >
                          Principal
                        </Typography>
                        <Box
                          sx={{
                            width: 40,
                            height: 2,
                            backgroundColor: 'rgba(255,255,255,0.6)',
                            mt: 1,
                            borderRadius: 1,
                            mx: { xs: 0, md: 'auto' },
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Side - Message */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <CardContent
                      sx={{
                        p: { xs: 3, md: 4 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                          fontSize: { xs: '1.4rem', md: '1.6rem' },
                          fontWeight: 700,
                          color: '#2c3e50',
                          mb: 2,
                          lineHeight: 1.2,
                        }}
                      >
                        Welcome Message
                      </Typography>
                      
                      <Box sx={{ position: 'relative', mb: 1 }}>
                        <Typography
                          sx={{
                            fontSize: { xs: '2.5rem', md: '3rem' },
                            color: 'primary.main',
                            opacity: 0.2,
                            position: 'absolute',
                            top: -10,
                            left: -5,
                            fontFamily: 'Georgia, serif',
                            lineHeight: 1,
                          }}
                        >
                          "
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          lineHeight: 1.6,
                          color: '#34495e',
                          fontStyle: 'italic',
                          mb: 2,
                          pl: 2,
                        }}
                      >
                        {schoolData.pages.homePage.principalSection.message}
                      </Typography>
                      
                      <Box
                        sx={{
                          borderLeft: '3px solid',
                          borderColor: 'primary.main',
                          pl: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                          }}
                        >
                          {schoolData?.name || 'School Name'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Box>
        )}

     {/* History Timeline */}
        {milestones.length > 0 && (
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: { md: 'space-between' },
              alignItems: { xs: 'center', md: 'flex-end' },
              textAlign: { xs: 'center', md: 'left' },
              mb: { xs: 4, md: 6 },
              px: { xs: 2, md: 0 },
              gap: { xs: 1, md: 2 }
            }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                mb: { xs: 1, md: 0 }
              }}
            >
              Our Journey
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: { md: '400px' }
              }}
            >
              Key milestones in our educational journey
            </Typography>
          </Box>
          <Grid 
            container 
            spacing={{ xs: 2, md: 3 }}
            sx={{
              mx: 0,
              width: '100%'
            }}
          >
            {milestones.map((milestone: TimelineMilestone, index: number) => {
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
        )}

        {/* Recent Updates & Announcements */}
        {announcements.length > 0 && (
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
            {announcements.map((announcement, index) => (
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} key={announcement.id || index}>
                <Card sx={{ 
                  border: index === 0 ? '2px solid' : 'none',
                  borderColor: index === 0 ? 'primary.main' : 'transparent',
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
                      {index === 0 && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            mr: 1,
                          }}
                        />
                      )}
                      <Typography variant="h6" component="h3">
                        {announcement.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {announcement.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={announcement.category || announcement.type} 
                        size="small" 
                        color={announcement.priority === 'high' ? 'primary' : 'default'} 
                      />
                      {announcement.date && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(announcement.date).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Paper>
        </Box>
        )}
        </Box>
        </Box>
      </Container>
    </Box>
  );
}
