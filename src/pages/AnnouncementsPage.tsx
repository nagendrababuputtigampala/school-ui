import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  Tabs,
  Tab,
  Grid,
  Paper,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Event,
  School,
  Notifications,
  Warning,
  EmojiEvents,
  LocalHospital,
  Group,
  PushPin,
  NotificationsActive
} from '@mui/icons-material';
import { useSchool } from '../contexts/SchoolContext';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'event' | 'exam' | 'general' | 'urgent' | 'sports' | 'health';
  audience: 'students' | 'parents' | 'staff' | 'public' | 'all';
  date: string;
  endDate?: string;
  isPinned: boolean;
  isUrgent: boolean;
  author: string;
}

export function AnnouncementsPage() {
  const { schoolData, loading } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Debug logging
  React.useEffect(() => {
    if (schoolData) {
      console.log('School data loaded:', {
        schoolName: schoolData.name,
        availablePages: Object.keys(schoolData?.pages || {}),
        hasAnnouncementsPage: !!schoolData?.pages?.announcementsPage,
        announcementsCount: schoolData?.pages?.announcementsPage ? Object.keys(schoolData.pages.announcementsPage).length : 0
      });
    }
  }, [schoolData]);

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

  // Get announcements from SchoolContext
  const getAnnouncements = (): Announcement[] => {
    if (!schoolData?.pages?.announcementsPage) {
      console.log('No announcements data found. Available pages:', Object.keys(schoolData?.pages || {}));
      return [];
    }
    
    // Check if it's an array (direct import) or object (from Firestore)
    const announcementsData = schoolData.pages.announcementsPage;
    let announcements: any[] = [];
    
    if (Array.isArray(announcementsData)) {
      announcements = announcementsData;
    } else {
      announcements = Object.values(announcementsData);
    }
    
    // Ensure each announcement has an id
    return announcements.map((announcement, index) => ({
      id: announcement.id || `announcement-${index + 1}`,
      ...announcement
    }));
  };

  const announcements: Announcement[] = getAnnouncements();

  // Generate dynamic categories based on available data
  const uniqueCategories = Array.from(new Set(announcements.map(a => a.category)));
  const allCategories = [
    { id: 'all', label: 'All', icon: Notifications },
    { id: 'urgent', label: 'Urgent', icon: Warning },
    { id: 'academic', label: 'Academic', icon: School },
    { id: 'exam', label: 'Exams', icon: School },
    { id: 'event', label: 'Events', icon: Event },
    { id: 'sports', label: 'Sports', icon: EmojiEvents },
    { id: 'health', label: 'Health', icon: LocalHospital },
    { id: 'general', label: 'General', icon: Group }
  ];
  const categories = allCategories.filter(cat => cat.id === 'all' || uniqueCategories.includes(cat.id as any));

  // Generate dynamic audiences based on available data
  const uniqueAudiences = Array.from(new Set(announcements.map(a => a.audience)));
  const allAudiences = [
    { id: 'all', label: 'All Audiences' },
    { id: 'students', label: 'Students' },
    { id: 'parents', label: 'Parents' },
    { id: 'staff', label: 'Staff' },
    { id: 'public', label: 'Public' }
  ];
  const audiences = allAudiences.filter(aud => aud.id === 'all' || uniqueAudiences.includes(aud.id as any));

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesAudience = selectedAudience === 'all' || announcement.audience === selectedAudience || announcement.audience === 'all';
    const matchesSearch = searchQuery === '' || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesAudience && matchesSearch;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
  const urgentAnnouncements = filteredAnnouncements.filter(a => a.isUrgent && !a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned && !a.isUrgent);

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? categoryData.icon : Notifications;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'error';
      case 'academic': return 'primary';
      case 'exam': return 'secondary';
      case 'event': return 'primary';
      case 'sports': return 'success';
      case 'health': return 'warning';
      default: return 'default';
    }
  };

  const stats = [
    { label: 'Pinned', value: pinnedAnnouncements.length, icon: PushPin, color: 'primary' },
    { label: 'Urgent', value: urgentAnnouncements.length, icon: Warning, color: 'error' },
    { label: 'Active', value: announcements.filter(a => a.endDate && new Date(a.endDate) > new Date()).length, icon: Event, color: 'success' },
    { label: 'Total', value: announcements.length, icon: NotificationsActive, color: 'info' },
  ];

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
    const CategoryIcon = getCategoryIcon(announcement.category);
    return (
      <Card
        sx={{
          transition: 'transform 0.25s, box-shadow 0.25s',
          '&:hover': {
            transform: { xs: 'none', md: 'translateY(-4px)' },
            boxShadow: { xs: 1, md: 4 },
          },
          border: announcement.isPinned ? 2 : announcement.isUrgent ? 2 : 1,
          borderColor: announcement.isPinned ? 'primary.main' : announcement.isUrgent ? 'error.main' : 'divider',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
            <Avatar sx={{ bgcolor: `${getCategoryColor(announcement.category)}.main`, width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}>
              <CategoryIcon fontSize={typeof window !== 'undefined' && window.innerWidth < 600 ? 'small' : 'medium'} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {announcement.isPinned && <PushPin color="primary" />}
                {announcement.isUrgent && <Warning color="error" />}
              </Box>
              <Typography
                component="h3"
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.05rem', md: '1.15rem' }, fontWeight: 600, lineHeight: 1.25, pr: { xs: 0, md: 2 } }}
              >
                {announcement.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
                <Chip label={announcement.category} size="small" color={getCategoryColor(announcement.category) as any} />
                <Chip label={announcement.audience} size="small" variant="outlined" />
              </Box>
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ fontSize: { xs: '0.72rem', sm: '0.8rem', md: '0.875rem' }, lineHeight: 1.4 }}
          >
            {announcement.content}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: { xs: 1.5, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}
          >
            <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Event sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                  {new Date(announcement.date).toLocaleDateString()}
                </Typography>
              </Box>
              {announcement.endDate && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                  Until {new Date(announcement.endDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
              {announcement.author}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
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
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            Stay updated with the latest news, events, and important information from EduConnect. 
            Filter by category or audience to find announcements relevant to you.
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mb: { xs: 4, md: 6 }, px: { xs: 0.5, sm: 1, md: 0 } }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid
                key={index}
                size={{ xs: 6, sm: 4, md: 3 }}
                sx={{ display: 'flex' }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2, sm: 2.5, md: 3 },
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}.main`,
                      width: { xs: 44, sm: 52, md: 56 },
                      height: { xs: 44, sm: 52, md: 56 },
                      mx: 'auto',
                      mb: { xs: 1, sm: 1.5, md: 2 },
                    }}
                  >
                    <IconComponent fontSize={typeof window !== 'undefined' && window.innerWidth < 600 ? 'small' : 'medium'} />
                  </Avatar>
                  <Typography
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      mb: 0.5,
                      fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={selectedCategory}
              onChange={(_, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
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

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={selectedAudience}
              onChange={(_, newValue) => setSelectedAudience(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {audiences.map((audience) => (
                <Tab
                  key={audience.id}
                  value={audience.id}
                  label={audience.label}
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        {/* Announcements */}
        <Box sx={{ mb: 6 }}>
          {loading ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Loading announcements...
              </Typography>
            </Paper>
          ) : announcements.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Announcements Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back later for school announcements and updates.
              </Typography>
            </Paper>
          ) : (
            <>
          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Typography component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' }, fontWeight: 600 }}>
                <PushPin color="primary" />
                Pinned Announcements
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {pinnedAnnouncements.map((announcement) => (
                  <Grid size={{ xs: 12 }} key={announcement.id}>
                    <AnnouncementCard announcement={announcement} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Urgent Announcements */}
          {urgentAnnouncements.length > 0 && (
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Typography component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' }, fontWeight: 600 }}>
                <Warning color="error" />
                Urgent Announcements
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {urgentAnnouncements.map((announcement) => (
                  <Grid size={{ xs: 12 }} key={announcement.id}>
                    <AnnouncementCard announcement={announcement} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Regular Announcements */}
          {regularAnnouncements.length > 0 && (
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <Typography component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' }, fontWeight: 600 }}>
                <Notifications color="primary" />
                Recent Announcements
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {regularAnnouncements.map((announcement) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={announcement.id}>
                    <AnnouncementCard announcement={announcement} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {filteredAnnouncements.length === 0 && (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No announcements found matching your criteria.
              </Typography>
            </Paper>
          )}
            </>
          )}
        </Box>
        </Box>
      </Container>
    </Box>
  );
}