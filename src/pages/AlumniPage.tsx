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
  TextField,
  Paper,
  Avatar,
  InputAdornment,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Work,
  School,
  LocationOn,
  LinkedIn,
  TrendingUp,
  EmojiEvents,
  People,
  Business,
} from '@mui/icons-material';

interface AlumniMember {
  id: string;
  name: string;
  graduationYear: string;
  currentPosition: string;
  company: string;
  location: string;
  industry: string;
  achievements: string[];
  image: string;
  bio: string;
  linkedIn?: string;
}

export function AlumniPage() {
  const [selectedDecade, setSelectedDecade] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
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

  const alumniMembers: AlumniMember[] = [
    {
      id: '1',
      name: 'Dr. Amanda Foster',
      graduationYear: '2010',
      currentPosition: 'Chief Technology Officer',
      company: 'TechInnovate Solutions',
      location: 'San Francisco, CA',
      industry: 'technology',
      achievements: ['Forbes 30 Under 30', 'Tech Innovation Award 2023', 'Startup Founder'],
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTMxNTUzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Leading digital transformation initiatives and pioneering AI solutions in healthcare technology.',
      linkedIn: 'linkedin.com/in/amandafoster'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      graduationYear: '2008',
      currentPosition: 'Senior Investment Banker',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      industry: 'finance',
      achievements: ['Top Performer 2022', 'MBA from Wharton', 'Financial Excellence Award'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzMTU1Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Specializes in corporate finance and mergers & acquisitions, helping companies achieve strategic growth.',
      linkedIn: 'linkedin.com/in/marcusjohnson'
    },
    {
      id: '3',
      name: 'Dr. Sarah Kim',
      graduationYear: '2012',
      currentPosition: 'Pediatric Surgeon',
      company: 'Children\'s Hospital Boston',
      location: 'Boston, MA',
      industry: 'healthcare',
      achievements: ['Medical Excellence Award', 'Research Publication Leader', 'Community Service Recognition'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzMTU1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Dedicated to improving children\'s health through innovative surgical techniques and compassionate care.',
      linkedIn: 'linkedin.com/in/sarahkim'
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      graduationYear: '2014',
      currentPosition: 'Environmental Engineer',
      company: 'Green Solutions Inc.',
      location: 'Seattle, WA',
      industry: 'engineering',
      achievements: ['Sustainability Innovation Prize', 'Green Building Certification', 'Environmental Leadership Award'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTMxNTU0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Focused on developing sustainable engineering solutions to combat climate change and protect our environment.',
      linkedIn: 'linkedin.com/in/alexrodriguez'
    },
    {
      id: '5',
      name: 'Jennifer Wu',
      graduationYear: '2009',
      currentPosition: 'Creative Director',
      company: 'Global Advertising Agency',
      location: 'Los Angeles, CA',
      industry: 'creative',
      achievements: ['Cannes Lions Gold Winner', 'Creative Excellence Award', 'Industry Trendsetter'],
      image: 'https://images.unsplash.com/photo-1494790108755-2616c67f20a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRpcmVjdG9yfGVufDF8fHx8MTc1OTMxNTU0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Leading creative campaigns for major brands and mentoring the next generation of creative professionals.',
      linkedIn: 'linkedin.com/in/jenniferwu'
    },
    {
      id: '6',
      name: 'David Thompson',
      graduationYear: '2011',
      currentPosition: 'High School Principal',
      company: 'Lincoln High School',
      location: 'Chicago, IL',
      industry: 'education',
      achievements: ['Principal of the Year', 'Education Innovation Leader', 'Community Impact Award'],
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmluY2lwYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzMTU1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Passionate about educational reform and creating inclusive learning environments for all students.',
      linkedIn: 'linkedin.com/in/davidthompson'
    },
    {
      id: '7',
      name: 'Rachel Green',
      graduationYear: '2013',
      currentPosition: 'Startup Founder & CEO',
      company: 'EcoTech Innovations',
      location: 'Austin, TX',
      industry: 'entrepreneurship',
      achievements: ['Entrepreneur of the Year', 'Successful IPO 2023', 'Innovation Breakthrough Award'],
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRyZXByZW5ldXIlMjB3b21hbnxlbnwxfHx8fDE3NTkzMTU1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Building sustainable technology solutions and creating positive environmental impact through innovation.',
      linkedIn: 'linkedin.com/in/rachelgreen'
    },
    {
      id: '8',
      name: 'Michael Brown',
      graduationYear: '2007',
      currentPosition: 'NASA Research Scientist',
      company: 'NASA Jet Propulsion Laboratory',
      location: 'Pasadena, CA',
      industry: 'science',
      achievements: ['Mars Mission Contributor', 'Scientific Excellence Award', 'Space Exploration Pioneer'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpc3QlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzMTU1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Contributing to groundbreaking space exploration missions and advancing our understanding of the universe.',
      linkedIn: 'linkedin.com/in/michaelbrown'
    }
  ];

  const decades = [
    { id: 'all', label: 'All Years' },
    { id: '2020s', label: '2020s' },
    { id: '2010s', label: '2010s' },
    { id: '2000s', label: '2000s' },
    { id: '1990s', label: '1990s' },
  ];

  const industries = [
    { id: 'all', label: 'All Industries', icon: Business },
    { id: 'technology', label: 'Technology', icon: Business },
    { id: 'finance', label: 'Finance', icon: TrendingUp },
    { id: 'healthcare', label: 'Healthcare', icon: Business },
    { id: 'engineering', label: 'Engineering', icon: Business },
    { id: 'creative', label: 'Creative', icon: Business },
    { id: 'education', label: 'Education', icon: School },
    { id: 'entrepreneurship', label: 'Entrepreneurship', icon: Business },
    { id: 'science', label: 'Science', icon: Business },
  ];

  const filteredAlumni = alumniMembers.filter(member => {
    const decade = Math.floor(parseInt(member.graduationYear) / 10) * 10;
    const decadeString = `${decade}s`;
    
    const matchesDecade = selectedDecade === 'all' || selectedDecade === decadeString;
    const matchesIndustry = selectedIndustry === 'all' || member.industry === selectedIndustry;
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.currentPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.achievements.some(achievement => achievement.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDecade && matchesIndustry && matchesSearch;
  });

  const stats = [
    { label: 'Alumni Network', value: '5,000+', color: '#1976d2' },
    { label: 'Countries Worldwide', value: '25+', color: '#388e3c' },
    { label: 'Fortune 500 CEOs', value: '12', color: '#f57c00' },
    { label: 'Advanced Degrees', value: '78%', color: '#7b1fa2' },
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
            Alumni Network
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
            Discover the incredible achievements of our graduates who are making a difference 
            in their fields and communities around the world.
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

        {/* Search and Filters */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Box sx={{ maxWidth: 500, mx: 'auto', mb: { xs: 2, md: 3 }, px: { xs: 1, md: 0 } }}>
            <TextField
              fullWidth
              placeholder="Search alumni by name, position, company, or achievements..."
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

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 2.5, md: 3 }, flexWrap: 'wrap' }}>
            <Paper sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}>
              <Tabs
                value={selectedDecade}
                onChange={(_, newValue) => setSelectedDecade(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {decades.map((decade) => (
                  <Tab key={decade.id} value={decade.id} label={decade.label} />
                ))}
              </Tabs>
            </Paper>
          </Box>
          <Paper sx={{ px: { xs: 1, md: 2 } }}>
            <Tabs
              value={selectedIndustry}
              onChange={(_, newValue) => setSelectedIndustry(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {industries.map((industry) => {
                const IconComponent = industry.icon;
                return (
                  <Tab
                    key={industry.id}
                    value={industry.id}
                    label={industry.label}
                    icon={<IconComponent />}
                    iconPosition="start"
                  />
                );
              })}
            </Tabs>
          </Paper>
        </Box>

        {/* Alumni Grid */}
        {filteredAlumni.length > 0 ? (
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }} 
            sx={{ mb: { xs: 5, md: 6 }, mx: 0, width: '100%' }}
          >
            {filteredAlumni.map((member) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={member.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-4px)' },
                      boxShadow: { xs: 2, md: 3 },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={250}
                    sx={{ height: { xs: 180, sm: 220, md: 250 }, objectFit: 'cover' }}
                    image={member.image}
                    alt={member.name}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 } }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
                    >
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      gutterBottom
                      sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}
                    >
                      Class of {member.graduationYear}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Work sx={{ fontSize: { xs: 14, md: 16 }, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                          {member.currentPosition}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Business sx={{ fontSize: { xs: 14, md: 16 }, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                          {member.company}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOn sx={{ fontSize: { xs: 14, md: 16 }, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                          {member.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      paragraph 
                      sx={{ flexGrow: 1, fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                    >
                      {member.bio}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                      >
                        <strong>Key Achievements:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {member.achievements.slice(0, 2).map((achievement, index) => (
                          <Chip 
                            key={index} 
                            label={achievement} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontSize: { xs: '0.6rem', md: '0.65rem' } }}
                          />
                        ))}
                        {member.achievements.length > 2 && (
                          <Chip 
                            label={`+${member.achievements.length - 2} more`} 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            sx={{ fontSize: { xs: '0.6rem', md: '0.65rem' } }}
                          />
                        )}
                      </Box>
                    </Box>

                    {member.linkedIn && (
                      <Button
                        startIcon={<LinkedIn />}
                        size="small"
                        sx={{ mt: 'auto', alignSelf: 'flex-start', fontSize: { xs: '0.65rem', md: '0.7rem' } }}
                      >
                        Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', mb: { xs: 5, md: 6 } }}>
            <People sx={{ fontSize: { xs: 48, md: 64 }, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}>
              No alumni found matching your criteria.
            </Typography>
          </Paper>
        )}

        {/* Alumni Network Benefits */}
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: { xs: 5, md: 6 }, backgroundColor: 'grey.50' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}
          >
            Alumni Network Benefits
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: { xs: 3, md: 4 }, maxWidth: '700px', mx: 'auto', fontSize: { xs: '0.95rem', md: '1rem' }, px: { xs: 1.5, md: 0 } }}
          >
            Our strong alumni network provides valuable opportunities for mentorship, 
            career development, and lifelong connections.
          </Typography>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{ mx: 0, width: '100%' }}
          >
            {[
              { title: 'Mentorship Program', desc: 'Connect with experienced alumni who can guide your career journey', icon: People, color: 'primary.main' },
              { title: 'Job Opportunities', desc: 'Access exclusive job postings and career opportunities through our network', icon: Work, color: 'success.main' },
              { title: 'Professional Development', desc: 'Attend exclusive events, workshops, and networking sessions', icon: TrendingUp, color: 'info.main' },
            ].map((b, i) => {
              const IconComp = b.icon;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Card 
                    sx={{ 
                      textAlign: 'center', 
                      p: { xs: 2, md: 3 }, 
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: { xs: 'none', md: 'translateY(-4px)' } }
                    }}
                  >
                    <Avatar sx={{ bgcolor: b.color, width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 }, mx: 'auto', mb: { xs: 1.5, md: 2 } }}>
                      <IconComp sx={{ fontSize: { xs: 24, md: 28 } }} />
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
                    >
                      {b.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                    >
                      {b.desc}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Paper
          sx={{
            p: { xs: 3.5, md: 6 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ fontSize: { xs: '1.9rem', md: '2.5rem' } }}
          >
            Join Our Alumni Network
          </Typography>
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              maxWidth: '700px', mx: 'auto', opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.15rem' }, px: { xs: 1.5, md: 0 }
            }}
          >
            Are you an EduConnect graduate? Connect with us and become part of our thriving 
            alumni community. Share your success story and help inspire current students.
          </Typography>
          <Box 
            sx={{ 
              mt: { xs: 3, md: 4 }, 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: 1.5, md: 2 }, 
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.25 },
                '&:hover': { backgroundColor: 'grey.100' },
              }}
            >
              Update Your Profile
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.25 },
                '&:hover': {
                  borderColor: 'grey.300',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Submit Your Story
            </Button>
          </Box>
        </Paper>
        </Box>
      </Container>
    </Box>
  );
}