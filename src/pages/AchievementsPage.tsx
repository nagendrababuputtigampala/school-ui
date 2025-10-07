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
  Button,
} from '@mui/material';
import {
  EmojiEvents,
  School,
  Science,
  Palette,
  Group,
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

  // Get achievements from school data or use fallback
  const getAchievements = () => {
    if (schoolData?.pages?.achievementsPage) {
      const allAchievements: Achievement[] = [];
      const achievementsData = schoolData.pages.achievementsPage;
      
      // Extract achievements from different sections
      Object.keys(achievementsData).forEach(sectionKey => {
        const section = achievementsData[sectionKey];
        if (section.achievements && Array.isArray(section.achievements)) {
          section.achievements.forEach((achievement: any, index: number) => {
            allAchievements.push({
              id: `${sectionKey}-${index}`,
              title: achievement.title || '',
              description: achievement.description || '',
              category: sectionKey.replace('Section', '').toLowerCase(),
              year: achievement.year || '2024',
              level: achievement.level || 'school',
              image: achievement.image || `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400`,
              participants: achievement.participants || '',
              award: achievement.award || 'Achievement Award'
            });
          });
        }
      });
      
      return allAchievements;
    }
    
    // Fallback achievements if no data from Firebase
    return fallbackAchievements;
  };

  const fallbackAchievements: Achievement[] = [
    {
      id: '1',
      title: 'National Science Fair Champions',
      description: 'Our robotics team won first place at the National Science Fair with their innovative environmental monitoring robot.',
      category: 'science',
      year: '2024',
      level: 'national',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc1OTMxNTQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: 'Team of 6 students',
      award: 'Gold Medal'
    },
    {
      id: '2',
      title: 'State Basketball Championship',
      description: 'Our varsity basketball team secured the state championship title for the third consecutive year.',
      category: 'sports',
      year: '2024',
      level: 'state',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY2hhbXBpb25zaGlwfGVufDF8fHx8MTc1OTMxNTQ5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: 'Varsity Team',
      award: 'Championship Trophy'
    },
    {
      id: '3',
      title: 'International Math Olympiad',
      description: 'Five of our students qualified for the International Math Olympiad, with two earning bronze medals.',
      category: 'academic',
      year: '2023',
      level: 'international',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoJTIwY29tcGV0aXRpb258ZW58MXx8fHwxNzU5MzE1NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: '5 students',
      award: '2 Bronze Medals'
    },
    {
      id: '4',
      title: 'Regional Art Exhibition Winner',
      description: 'Our student artwork was featured prominently at the Regional Art Exhibition, winning multiple categories.',
      category: 'arts',
      year: '2023',
      level: 'district',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9ufGVufDF8fHx8MTc1OTMxNTUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: '12 student artists',
      award: 'Best School Display'
    },
    {
      id: '5',
      title: 'Environmental Leadership Award',
      description: 'Recognized for our outstanding commitment to environmental sustainability and green initiatives.',
      category: 'community',
      year: '2023',
      level: 'state',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwc3VzdGFpbmFiaWxpdHl8ZW58MXx8fHwxNzU5MzE1NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: 'Entire school community',
      award: 'Green School Certification'
    },
    {
      id: '6',
      title: 'Drama Competition Excellence',
      description: 'Our theater group won first place in the district drama competition with their original production.',
      category: 'arts',
      year: '2023',
      level: 'district',
      image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzU5MzE1NTA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: 'Drama Club (25 students)',
      award: 'First Place Trophy'
    },
    {
      id: '7',
      title: 'Coding Competition Victory',
      description: 'Our computer science students dominated the regional coding competition, placing in top 3 positions.',
      category: 'science',
      year: '2022',
      level: 'district',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NTkzMTU1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: '8 students',
      award: '1st, 2nd, and 3rd Place'
    },
    {
      id: '8',
      title: 'Community Service Recognition',
      description: 'Honored for exceptional community service contributions, including 1000+ hours of volunteer work.',
      category: 'community',
      year: '2022',
      level: 'district',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc1OTMxNTUxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      participants: '200+ students',
      award: 'Service Excellence Award'
    }
  ];

  const achievements = getAchievements();

  const categories = [
    { id: 'all', label: 'All Achievements', icon: EmojiEvents },
    { id: 'academic', label: 'Academic', icon: School },
    { id: 'science', label: 'Science & Tech', icon: Science },
    { id: 'sports', label: 'Sports', icon: EmojiEvents },
    { id: 'arts', label: 'Arts & Culture', icon: Palette },
    { id: 'community', label: 'Community', icon: Group },
  ];

  const levels = [
    { id: 'international', label: 'International', color: '#d32f2f', icon: Public },
    { id: 'national', label: 'National', color: '#f57c00', icon: Star },
    { id: 'state', label: 'State', color: '#388e3c', icon: TrendingUp },
    { id: 'district', label: 'District', color: '#1976d2', icon: WorkspacePremium },
    { id: 'school', label: 'School', color: '#7b1fa2', icon: School },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter((achievement: Achievement) => achievement.category === selectedCategory);

  const stats = [
    { label: 'Total Awards', value: achievements.length, color: '#1976d2' },
    { label: 'National Honors', value: achievements.filter((a: Achievement) => a.level === 'national').length, color: '#f57c00' },
    { label: 'State Titles', value: achievements.filter((a: Achievement) => a.level === 'state').length, color: '#388e3c' },
    { label: 'This Year', value: achievements.filter((a: Achievement) => a.year === '2024').length, color: '#d32f2f' },
  ];

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
        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 4 }} 
          sx={{ mb: { xs: 5, md: 6 }, mx: 0, width: '100%' }}
        >
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }} key={index}>
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
            {filteredAchievements.map((achievement: Achievement) => (
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

        {/* Recognition Levels */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: { xs: 5, md: 6 }, backgroundColor: 'grey.50' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
          >
            Recognition Levels
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: { xs: 3, md: 4 }, maxWidth: '600px', mx: 'auto', fontSize: { xs: '0.95rem', md: '1rem' }, px: { xs: 1.5, md: 0 } }}
          >
            Our achievements span across multiple levels of recognition, from local competitions 
            to international honors.
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1, sm: 1.5, md: 2 }, 
              justifyContent: 'center' 
            }}
          >
            {levels.map((level) => {
              const IconComponent = level.icon;
              const count = achievements.filter((a: Achievement) => a.level === level.id).length;
              return (
                <Chip
                  key={level.id}
                  label={`${level.label} (${count})`}
                  icon={<IconComponent />}
                  sx={{
                    backgroundColor: level.color,
                    color: 'white',
                    fontWeight: 'bold',
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 0.75, md: 1 },
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    '& .MuiChip-icon': { color: 'white', fontSize: { xs: '0.9rem', md: '1rem' } },
                  }}
                />
              );
            })}
          </Box>
        </Paper>
      </Box>
      </Container>
    </Box>
  );
}