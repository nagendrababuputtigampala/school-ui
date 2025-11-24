import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Paper,
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
  People,
  Business,
} from '@mui/icons-material';
import { useSchool } from '../contexts/SchoolContext';

interface AlumniMember {
  name: string;
  graduationYear: string;
  currentPosition: string;
  company: string;
  location: string;
  industry: string;
  image: string;
  linkedIn?: string;
}

export function AlumniPage() {
  const { schoolData, loading } = useSchool();
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

  // Get alumni data from school context
  const getAlumniMembers = (): AlumniMember[] => {
    if (schoolData?.pages?.alumniPage) {
      const alumniData = schoolData.pages.alumniPage;
      
      // Convert Firestore object format to array
      const alumniArray = Object.values(alumniData);
      
      return alumniArray.map((alumni: any, index: number): AlumniMember => ({
        name: alumni.name,
        graduationYear: alumni.graduationYear,
        currentPosition: alumni.currentPosition,
        company: alumni.company,
        location: alumni.location,
        industry: alumni.industry,
        image: alumni.image,
        linkedIn: alumni.linkedIn
      }));
    }
    
    return [];
  };

  const alumniMembers = getAlumniMembers();

  // Don't load component if no alumni data
  if (!schoolData?.pages?.alumniPage || alumniMembers.length === 0) {
    return null;
  }

  // Generate decades dynamically from alumni data
  const getDecades = () => {
    const uniqueDecades = Array.from(new Set(alumniMembers.map(alumni => {
      const decade = Math.floor(parseInt(alumni.graduationYear) / 10) * 10;
      return `${decade}s`;
    })));
    
    const dynamicDecades = uniqueDecades.map(decade => ({
      id: decade,
      label: decade
    }));

    return [
      { id: 'all', label: 'All Years' },
      ...dynamicDecades
    ];
  };

  // Generate industries dynamically from alumni data
  const getIndustries = () => {
    const uniqueIndustries = Array.from(new Set(alumniMembers.map(alumni => alumni.industry)));
    
    const dynamicIndustries = uniqueIndustries.map(industry => ({
      id: industry,
      label: industry.charAt(0).toUpperCase() + industry.slice(1),
      icon: 'Business'
    }));

    return [
      { id: 'all', label: 'All Industries', icon: 'Business' },
      ...dynamicIndustries
    ];
  };

  const decades = getDecades();
  const industries = getIndustries();

  // Add icon mapping for industries
  const iconMap: { [key: string]: any } = {
    'Business': Business,
    'TrendingUp': TrendingUp,
    'School': School,
  };

  const filteredAlumni = alumniMembers.filter(member => {
    const decade = Math.floor(parseInt(member.graduationYear) / 10) * 10;
    const decadeString = `${decade}s`;
    
    const matchesDecade = selectedDecade === 'all' || selectedDecade === decadeString;
    const matchesIndustry = selectedIndustry === 'all' || member.industry === selectedIndustry;
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.currentPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDecade && matchesIndustry && matchesSearch;
  });

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
            Discover the incredible achievements of our graduates who are making a difference 
            in their fields and communities around the world.
          </Typography>
        </Box>
        {/* Search and Filters */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Box sx={{ maxWidth: 500, mx: 'auto', mb: { xs: 2, md: 3 }, px: { xs: 1, md: 0 } }}>
            <TextField
              fullWidth
              placeholder="Search alumni by name, position, or company..."
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
                const IconComponent = iconMap[industry.icon] || Business;
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
            {filteredAlumni.map((member, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
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
        </Box>
      </Container>
    </Box>
  );
}