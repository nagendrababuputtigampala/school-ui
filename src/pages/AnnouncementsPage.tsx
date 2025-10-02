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
  Button,
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
  tags: string[];
}

export function AnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Annual Day Celebration - March 20, 2024',
      content: 'Join us for our spectacular Annual Day celebration featuring student performances, cultural programs, and award ceremonies. The event will start at 5:00 PM in the main auditorium. Parents and guardians are cordially invited to attend this memorable celebration of student achievements.',
      category: 'event',
      audience: 'all',
      date: '2024-03-01',
      endDate: '2024-03-20',
      isPinned: true,
      isUrgent: false,
      author: 'Principal Office',
      tags: ['celebration', 'performance', 'awards', 'family']
    },
    {
      id: '2',
      title: 'Mid-Term Examination Schedule Released',
      content: 'The mid-term examination schedule for all grades has been published. Exams will commence from March 25th and conclude on April 5th. Students are advised to collect their hall tickets from their respective class teachers. Study materials and revision schedules are available on the student portal.',
      category: 'exam',
      audience: 'students',
      date: '2024-03-10',
      endDate: '2024-04-05',
      isPinned: true,
      isUrgent: true,
      author: 'Academic Office',
      tags: ['examination', 'schedule', 'hall ticket', 'study']
    },
    {
      id: '3',
      title: 'Parent-Teacher Conference - March 15, 2024',
      content: 'We invite all parents to attend the quarterly parent-teacher conference to discuss student progress and academic performance. Meetings will be held from 9:00 AM to 4:00 PM. Please schedule your appointment through the parent portal or contact the main office.',
      category: 'event',
      audience: 'parents',
      date: '2024-03-05',
      endDate: '2024-03-15',
      isPinned: false,
      isUrgent: false,
      author: 'Student Affairs',
      tags: ['parents', 'teachers', 'progress', 'meeting']
    },
    {
      id: '4',
      title: 'School Closure - Spring Break',
      content: 'The school will remain closed from April 8th to April 16th for spring break. Regular classes will resume on April 17th. During this period, the administrative office will be open from 10:00 AM to 2:00 PM for urgent matters only.',
      category: 'general',
      audience: 'all',
      date: '2024-03-20',
      endDate: '2024-04-16',
      isPinned: false,
      isUrgent: false,
      author: 'Administration',
      tags: ['holiday', 'closure', 'spring break']
    },
    {
      id: '5',
      title: 'Basketball Team Tryouts Begin',
      content: 'Tryouts for the varsity basketball team will begin on March 18th. All interested students from grades 9-12 are eligible to participate. Please bring your sports physical form and wear appropriate athletic attire. Tryouts will be held in the gymnasium from 3:30 PM to 5:30 PM.',
      category: 'sports',
      audience: 'students',
      date: '2024-03-12',
      endDate: '2024-03-22',
      isPinned: false,
      isUrgent: false,
      author: 'Athletics Department',
      tags: ['basketball', 'tryouts', 'sports', 'gymnasium']
    },
    {
      id: '6',
      title: 'Health and Vaccination Update',
      content: 'Important reminder: All students must submit updated vaccination records by March 30th. The school nurse will be available for health consultations every Tuesday and Thursday from 9:00 AM to 3:00 PM. Please ensure all health forms are complete and submitted to the health office.',
      category: 'health',
      audience: 'parents',
      date: '2024-03-08',
      endDate: '2024-03-30',
      isPinned: false,
      isUrgent: true,
      author: 'Health Office',
      tags: ['vaccination', 'health', 'forms', 'nurse']
    },
    {
      id: '7',
      title: 'New Library Study Hours',
      content: 'The library will now be open for extended hours to support student learning. New timings: Monday to Friday 7:00 AM to 7:00 PM, Saturday 9:00 AM to 5:00 PM. Group study rooms are available for reservation through the library system.',
      category: 'academic',
      audience: 'students',
      date: '2024-03-02',
      isPinned: false,
      isUrgent: false,
      author: 'Library Services',
      tags: ['library', 'study', 'hours', 'reservation']
    },
    {
      id: '8',
      title: 'Emergency Contact Information Update',
      content: 'All families are required to update their emergency contact information by March 25th. Please log into the parent portal and verify all contact numbers, addresses, and emergency contacts. This information is crucial for student safety and communication.',
      category: 'urgent',
      audience: 'parents',
      date: '2024-03-14',
      endDate: '2024-03-25',
      isPinned: true,
      isUrgent: true,
      author: 'Safety Office',
      tags: ['emergency', 'contact', 'safety', 'update']
    },
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Notifications },
    { id: 'urgent', label: 'Urgent', icon: Warning },
    { id: 'academic', label: 'Academic', icon: School },
    { id: 'exam', label: 'Exams', icon: School },
    { id: 'event', label: 'Events', icon: Event },
    { id: 'sports', label: 'Sports', icon: EmojiEvents },
    { id: 'health', label: 'Health', icon: LocalHospital },
    { id: 'general', label: 'General', icon: Group }
  ];

  const audiences = [
    { id: 'all', label: 'All Audiences' },
    { id: 'students', label: 'Students' },
    { id: 'parents', label: 'Parents' },
    { id: 'staff', label: 'Staff' },
    { id: 'public', label: 'Public' }
  ];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesAudience = selectedAudience === 'all' || announcement.audience === selectedAudience || announcement.audience === 'all';
    const matchesSearch = searchQuery === '' || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
          {announcement.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
              {announcement.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}
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
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            Announcements
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
        </Box>

        {/* Notification Signup */}
        <Paper sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Stay Updated
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '600px', mx: 'auto', mb: 3, opacity: 0.9 }}>
            Never miss important announcements! Sign up for our notification system to receive 
            updates via email or SMS for urgent announcements and events.
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}>
            Subscribe to Notifications
          </Button>
        </Paper>
        </Box>
      </Container>
    </Box>
  );
}