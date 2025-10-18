import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Avatar,
  Paper,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Email,
  Phone,
  School,
  Science,
  Palette,
  EmojiEvents,
  Business,
  LocalHospital,
  MenuBook,
  Category,
} from '@mui/icons-material';
import { useSchool } from '../contexts/SchoolContext';

interface StaffMember {
  id?: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  specializations: string[];
  image: string;
}

interface Department {
  id: string;
  label: string;
}

export function StaffDirectoryPage() {
  const { schoolData, loading } = useSchool();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
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

  // Get staff data from school context
  const getStaffMembers = (): StaffMember[] => {
    if (schoolData?.pages?.staffPage) {
      const staffData = schoolData.pages.staffPage;
      
      // Convert Firestore object format to array
      const staffArray = Object.values(staffData);
      
      return staffArray.map((staff: any, index: number): StaffMember => ({
        id: staff.id || `staff-${index}`,
        name: staff.name,
        position: staff.position,
        department: staff.department,
        email: staff.email,
        phone: staff.phone,
        education: staff.education,
        experience: staff.experience,
        specializations: staff.specializations,
        image: staff.image
      }));
    }
    
    return [];
  };

  const staffMembers = getStaffMembers();

  // Don't load component if no staff data
  if (!schoolData?.pages?.staffPage || staffMembers.length === 0) {
    return null;
  }

  // Generate departments dynamically from staff data
  const getDepartments = (): Department[] => {
    const staffMembers = getStaffMembers();
    const uniqueDepartments = Array.from(new Set(staffMembers.map(staff => staff.department)));
    
    return uniqueDepartments.map(dept => ({
      id: dept,
      label: formatDepartmentLabel(dept)
    }));
  };

  // Helper function to format department labels
  const formatDepartmentLabel = (departmentId: string): string => {
    const labelMap: { [key: string]: string } = {
      'administration': 'Administration',
      'mathematics': 'Mathematics',
      'science': 'Science',
      'english': 'English',
      'social_studies': 'Social Studies',
      'arts': 'Arts',
      'athletics': 'Athletics',
      'counseling': 'Counseling',
      'health': 'Health Services',
      'music': 'Music',
      'technology': 'Technology',
      'library': 'Library',
      'languages': 'World Languages',
      'other': 'Other'
    };
    
    return labelMap[departmentId.toLowerCase()] || departmentId.charAt(0).toUpperCase() + departmentId.slice(1);
  };

  const departments = getDepartments();



  // Icon mapping for common departments
  const getDepartmentIcon = (departmentId: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'all': School,
      'administration': Business,
      'mathematics': MenuBook,
      'science': Science,
      'english': MenuBook,
      'social_studies': MenuBook,
      'arts': Palette,
      'athletics': EmojiEvents,
      'counseling': School,
      'health': LocalHospital,
      'other': Category
    };
    return iconMap[departmentId.toLowerCase()] || Category;
  };

  // Build departments list with "All Staff" option
  const allDepartments = [
    { id: 'all', label: 'All Staff', icon: School },
    ...departments.map(dept => ({
      id: dept.id,
      label: dept.label,
      icon: getDepartmentIcon(dept.id)
    }))
  ];

  const filteredStaff = staffMembers.filter(member => {
    // Handle department filtering
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDepartment && matchesSearch;
  });

  const allStats = [
    { label: 'Total Faculty', value: staffMembers.length },
    { label: 'Ph.D. Holders', value: staffMembers.filter(s => s.education.toLowerCase().includes('ph.d')).length },
    { label: 'Departments', value: departments.length },
    { label: 'Masters+', value: staffMembers.filter(s => s.education.toLowerCase().includes('m.') || s.education.toLowerCase().includes('master')).length },
  ];

  // Filter out stats with 0, null, or undefined values
  const stats = allStats.filter(stat => 
    stat.value !== null && 
    stat.value !== undefined && 
    stat.value > 0
  );

  // Calculate grid size based on number of visible stats
  const getGridSize = () => {
    if (stats.length === 1) return { xs: 6, sm: 6, md: 6 }; // Centered half-width
    if (stats.length === 2) return { xs: 6, sm: 6, md: 6 }; // Half width each
    if (stats.length === 3) return { xs: 6, sm: 4, md: 4 }; // Third width each
    return { xs: 6, sm: 6, md: 3 }; // Quarter width for 4+
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress />
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
            Meet our dedicated team of educators and staff members who are committed to 
            providing exceptional education and support to our students.
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
                    bgcolor: 'primary.main',
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    mx: 'auto',
                    mb: { xs: 1.5, md: 2 },
                  }}
                >
                  <School sx={{ fontSize: { xs: 24, sm: 28 } }} />
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

        {/* Search and Filters */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Box sx={{ maxWidth: 500, mx: 'auto', mb: { xs: 2, md: 3 }, px: { xs: 1, md: 0 } }}>
            <TextField
              fullWidth
              placeholder="Search staff by name, position, or specialization..."
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
          <Paper sx={{ px: { xs: 1, md: 2 } }}>
            <Tabs
              value={selectedDepartment}
              onChange={(_, newValue) => setSelectedDepartment(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {allDepartments.map((department) => {
                const IconComponent = department.icon;
                return (
                  <Tab
                    key={department.id}
                    value={department.id}
                    label={department.label}
                    icon={<IconComponent />}
                    iconPosition="start"
                  />
                );
              })}
            </Tabs>
          </Paper>
        </Box>

        {/* Staff Grid */}
        {filteredStaff.length > 0 ? (
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }} 
            sx={{ mb: { xs: 5, md: 6 }, mx: 0, width: '100%' }}
          >
            {filteredStaff.map((member) => (
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
                  <Box sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{ width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 }, mx: 'auto', mb: { xs: 1.5, md: 2 } }}
                    />
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
                      {member.position}
                    </Typography>
                    <Chip
                      label={allDepartments.find(d => d.id === member.department)?.label || 'Other'}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pt: 0, px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
                    <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                      >
                        <strong>Education:</strong> {member.education}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                      >
                        <strong>Experience:</strong> {member.experience}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: { xs: 2, md: 3 } }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                      >
                        <strong>Specializations:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: { xs: 1.5, md: 2 } }}>
                        {member.specializations.map((spec, index) => (
                          <Chip 
                            key={`${member.id}-spec-${index}`} 
                            label={spec} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontSize: { xs: '0.6rem', md: '0.65rem' } }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Email sx={{ fontSize: { xs: 14, md: 16 }, color: 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                        >
                          {member.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ fontSize: { xs: 14, md: 16 }, color: 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                        >
                          {member.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', mb: { xs: 5, md: 6 } }}>
            <School sx={{ fontSize: { xs: 48, md: 64 }, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }}>
              No staff members found matching your criteria.
            </Typography>
          </Paper>
        )}
        </Box>
      </Container>
    </Box>
  );
}