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
  NotificationsActive,
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
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
          border: announcement.isPinned ? 2 : announcement.isUrgent ? 2 : 1,
          borderColor: announcement.isPinned ? 'primary.main' : announcement.isUrgent ? 'error.main' : 'divider',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: `${getCategoryColor(announcement.category)}.main` }}>
              <CategoryIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {announcement.isPinned && <PushPin color="primary" />}
                {announcement.isUrgent && <Warning color="error" />}
              </Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {announcement.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={announcement.category}
                  size="small"
                  color={getCategoryColor(announcement.category) as any}
                />
                <Chip
                  label={announcement.audience}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {announcement.content}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Event sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {new Date(announcement.date).toLocaleDateString()}
                </Typography>
              </Box>
              {announcement.endDate && (
                <Typography variant="caption" color="text.secondary">
                  Until {new Date(announcement.endDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {announcement.author}
            </Typography>
          </Box>

          {announcement.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Announcements
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Stay informed with the latest news, updates, and important information from EduConnect. 
            Find announcements for students, parents, staff, and the general public.
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid size={3} key={index}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}.main`,
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
                  <Typography variant="body2" color="text.secondary">
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
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PushPin color="primary" />
                Pinned Announcements
              </Typography>
              <Grid container spacing={3}>
                {pinnedAnnouncements.map((announcement) => (
                  <Grid size={12} key={announcement.id}>
                    <AnnouncementCard announcement={announcement} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Urgent Announcements */}
          {urgentAnnouncements.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="error" />
                Urgent Announcements
              </Typography>
              <Grid container spacing={3}>
                {urgentAnnouncements.map((announcement) => (
                  <Grid size={12} key={announcement.id}>
                    <AnnouncementCard announcement={announcement} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Regular Announcements */}
          {regularAnnouncements.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications color="primary" />
                Recent Announcements
              </Typography>
              <Grid container spacing={3}>
                {regularAnnouncements.map((announcement) => (
                  <Grid  size={12} key={announcement.id}>
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
  );
}