import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Tabs,
  Tab,
  Paper,
  Avatar,
} from '@mui/material';
import {
  EmojiEvents,
  School,
  Public,
  Star,
  TrendingUp,
  WorkspacePremium,
} from '@mui/icons-material';
import { useSchool } from '../contexts/SchoolContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  level: 'school' | 'district' | 'state' | 'national' | 'international';
  image: string;
  participants?: string;
  award: string;
}

export function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { schoolData, loading } = useSchool();

  // Match responsive behavior: prevent horizontal scroll & set viewport
  React.useEffect(() => {
    document.body.style.overflowX = 'hidden';
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
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

  // Get achievements from school data
  const getAchievements = (): Achievement[] => {
    if (schoolData?.pages?.achievementsPage) {
      const achievementsData = schoolData.pages.achievementsPage;
      
      // Convert Firestore object format to array
      const achievementsArray = Object.values(achievementsData);
      
      return achievementsArray.map((achievement: any, index: number): Achievement => ({
        id: achievement.id || `achievement-${index}`,
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        year: achievement.year,
        level: achievement.level,
        image: achievement.images?.[0] || achievement.image,
        participants: achievement.participants,
        award: achievement.award
      }));
    }
    
    return [];
  };

  const achievements: Achievement[] = getAchievements();

  // Don't load component if no achievements data
  if (!schoolData?.pages?.achievementsPage || achievements.length === 0) {
    return null;
  }

  // Generate categories dynamically from achievements data
  const getCategories = () => {
    // Extract unique categories from achievements, filtering out null/undefined values
    const uniqueCategories = Array.from(new Set(
      achievements
        .map(achievement => achievement.category)
        .filter(category => category && typeof category === 'string')
    ));
    
    const dynamicCategories = uniqueCategories.map(category => ({
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter only
      icon: EmojiEvents, // Use consistent icon for all categories
    }));

    // Always include "All Achievements" as the first option
    return [
      { id: 'all', label: 'All Achievements', icon: EmojiEvents },
      ...dynamicCategories
    ];
  };

  const categories = getCategories();

  const levels = [
    { id: 'international', label: 'International', color: '#d32f2f', icon: Public },
    { id: 'national', label: 'National', color: '#f57c00', icon: Star },
    { id: 'state', label: 'State', color: '#388e3c', icon: TrendingUp },
    { id: 'district', label: 'District', color: '#1976d2', icon: WorkspacePremium },
    { id: 'school', label: 'School', color: '#7b1fa2', icon: School },
  ];

  const filteredAchievements: Achievement[] = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter((achievement) => achievement.category === selectedCategory);

  const allStats = [
    { label: 'Total Awards', value: achievements.length, color: '#1976d2' },
    { label: 'National Honors', value: achievements.filter((a) => a.level === 'national').length, color: '#f57c00' },
    { label: 'State Titles', value: achievements.filter((a) => a.level === 'state').length, color: '#388e3c' },
    { label: 'This Year', value: achievements.filter((a) => a.year === '2024').length, color: '#d32f2f' },
  ];

  // Filter out stats with 0, null, or undefined values
  const stats = allStats.filter(stat => 
    stat.value !== null && 
    stat.value !== undefined && 
    stat.value > 0
  );

  // Dynamic grid sizing based on number of visible stats
  const getGridSize = () => {
    const count = stats.length;
    if (count === 1) return { xs: 12, sm: 12, md: 6, lg: 4 }; // Single stat - centered
    if (count === 2) return { xs: 6, sm: 6, md: 6, lg: 6 }; // Two stats - half width each
    if (count === 3) return { xs: 6, sm: 4, md: 4, lg: 4 }; // Three stats - third width each
    return { xs: 6, sm: 6, md: 3, lg: 3 }; // Four or more stats - quarter width each
  };

  const getLevelChip = (level: string) => {
    const levelData = levels.find(l => l.id === level);
    return levelData ? (
      <Chip
        label={levelData.label}
        size="small"
        sx={{
          backgroundColor: levelData.color,
          color: 'white',
          fontWeight: 'bold',
        }}
        icon={<levelData.icon sx={{ color: 'white !important' }} />}
      />
    ) : null;
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
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
        disableGutters
        sx={{
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
      <Box sx={{ py: { xs: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, px: { xs: 1, md: 0 } }}>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', mx: 'auto', px: { xs: 1.5, md: 0 },
              fontSize: { xs: '1rem', md: '1.15rem' }
            }}
          >
            Celebrating excellence in academics, sports, arts, and community service. 
            Our students and faculty continue to set new standards of achievement.
          </Typography>
        </Box>

        {/* Statistics */}
        {stats.length > 0 && (
        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 4 }} 
          sx={{ 
            mb: { xs: 5, md: 6 }, 
            mx: 0, 
            width: '100%',
            justifyContent: stats.length < 4 ? 'center' : 'flex-start'
          }}
        >
          {stats.map((stat, index) => (
            <Grid size={getGridSize()} key={stat.label}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: { xs: 2, sm: 2.5, md: 3 },
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: { xs: 'none', md: 'translateY(-4px)' } }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    mx: 'auto',
                    mb: { xs: 1.5, md: 2 },
                  }}
                >
                  <EmojiEvents sx={{ fontSize: { xs: 24, sm: 28 } }} />
                </Avatar>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}
                >
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}

        {/* Category Tabs */}
        <Paper sx={{ mb: { xs: 3, md: 4 }, px: { xs: 1, md: 2 } }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Tab
                  key={category.id}
                  value={category.id}
                  label={category.label}
                  icon={<IconComponent />}
                  iconPosition="start"
                />
              );
            })}
          </Tabs>
        </Paper>

        {/* Achievement Grid */}
        {filteredAchievements.length > 0 ? (
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }} 
            sx={{ mb: { xs: 5, md: 6 }, mx: 0, width: '100%' }}
          >
            {filteredAchievements.map((achievement) => (
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={achievement.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-4px)' },
                      boxShadow: { xs: 2, md: 4 },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={200}
                    sx={{ height: { xs: 160, sm: 190, md: 200 }, objectFit: 'cover' }}
                    image={achievement.image}
                    alt={achievement.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1.5, md: 2 }, gap: 1 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ flexGrow: 1, pr: 1, fontSize: { xs: '1rem', md: '1.1rem' } }}
                      >
                        {achievement.title}
                      </Typography>
                      <Chip label={achievement.year} color="primary" size="small" />
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      paragraph 
                      sx={{ flexGrow: 1, fontSize: { xs: '0.85rem', md: '0.9rem' } }}
                    >
                      {achievement.description}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.5, md: 2 }, gap: 1 }}>
                        {getLevelChip(achievement.level)}
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.65rem', md: '0.7rem' }, textAlign: 'right' }}
                        >
                          {achievement.participants}
                        </Typography>
                      </Box>
                      <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmojiEvents sx={{ fontSize: { xs: 18, md: 20 } }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                            {achievement.award}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', mb: { xs: 5, md: 6 } }}>
            <EmojiEvents sx={{ fontSize: { xs: 48, md: 64 }, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}>
              No achievements found in this category.
            </Typography>
          </Paper>
        )}
      </Box>
      </Container>
    </Box>
  );
}