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
  Button,
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
  DirectionsBus,
  MenuBook,
} from '@mui/icons-material';

interface StaffMember {
  id: string;
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

export function StaffDirectoryPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      position: 'Principal',
      department: 'administration',
      email: 's.johnson@educonnect.edu',
      phone: '(555) 123-4570',
      education: 'Ph.D. in Educational Leadership, Harvard University',
      experience: '15 years in educational administration',
      specializations: ['Educational Leadership', 'Curriculum Development', 'School Management'],
      image: 'https://images.unsplash.com/photo-1494790108755-2616c67f20a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTMxNTUxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Vice Principal',
      department: 'administration',
      email: 'm.chen@educonnect.edu',
      phone: '(555) 123-4571',
      education: 'M.Ed. in Educational Administration, Stanford University',
      experience: '12 years in academic administration',
      specializations: ['Student Affairs', 'Academic Planning', 'Faculty Development'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzMTU1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      position: 'Mathematics Department Head',
      department: 'mathematics',
      email: 'e.rodriguez@educonnect.edu',
      phone: '(555) 123-4572',
      education: 'Ph.D. in Mathematics, MIT',
      experience: '10 years teaching advanced mathematics',
      specializations: ['Calculus', 'Statistics', 'Competition Math'],
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5MzE1NTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '4',
      name: 'James Wilson',
      position: 'Science Department Head',
      department: 'science',
      email: 'j.wilson@educonnect.edu',
      phone: '(555) 123-4573',
      education: 'Ph.D. in Chemistry, CalTech',
      experience: '14 years in science education',
      specializations: ['Chemistry', 'Physics', 'Environmental Science'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwdGVhY2hlcnxlbnwxfHx8fDE3NTkzMTU1MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      position: 'English Department Head',
      department: 'english',
      email: 'l.thompson@educonnect.edu',
      phone: '(555) 123-4574',
      education: 'M.A. in English Literature, Yale University',
      experience: '11 years teaching English and Literature',
      specializations: ['Creative Writing', 'American Literature', 'Public Speaking'],
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwdGVhY2hlcnxlbnwxfHx8fDE3NTkzMTU1MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '6',
      name: 'Robert Martinez',
      position: 'History Department Head',
      department: 'social_studies',
      email: 'r.martinez@educonnect.edu',
      phone: '(555) 123-4575',
      education: 'Ph.D. in History, Columbia University',
      experience: '13 years in social studies education',
      specializations: ['World History', 'Government', 'Economics'],
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3J5JTIwdGVhY2hlcnxlbnwxfHx8fDE3NTkzMTU1MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '7',
      name: 'Maria Gonzalez',
      position: 'Art Department Head',
      department: 'arts',
      email: 'm.gonzalez@educonnect.edu',
      phone: '(555) 123-4576',
      education: 'M.F.A. in Fine Arts, RISD',
      experience: '9 years teaching visual arts',
      specializations: ['Painting', 'Sculpture', 'Digital Art'],
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB0ZWFjaGVyfGVufDF8fHx8MTc1OTMxNTUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '8',
      name: 'Coach David Brown',
      position: 'Athletic Director',
      department: 'athletics',
      email: 'd.brown@educonnect.edu',
      phone: '(555) 123-4577',
      education: 'M.S. in Exercise Science, University of Florida',
      experience: '16 years in athletic program management',
      specializations: ['Basketball', 'Track & Field', 'Sports Medicine'],
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMGRpcmVjdG9yfGVufDF8fHx8MTc1OTMxNTUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '9',
      name: 'Dr. Jennifer Lee',
      position: 'School Counselor',
      department: 'counseling',
      email: 'j.lee@educonnect.edu',
      phone: '(555) 123-4578',
      education: 'Ph.D. in School Psychology, UCLA',
      experience: '8 years in student counseling',
      specializations: ['Academic Guidance', 'College Preparation', 'Mental Health'],
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Vuc2Vsb3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzMTU1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '10',
      name: 'Nurse Patricia Adams',
      position: 'School Nurse',
      department: 'health',
      email: 'p.adams@educonnect.edu',
      phone: '(555) 123-4579',
      education: 'BSN in Nursing, Johns Hopkins University',
      experience: '7 years in school health services',
      specializations: ['First Aid', 'Health Education', 'Emergency Care'],
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBudXJzZXxlbnwxfHx8fDE3NTkzMTU1MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const departments = [
    { id: 'all', label: 'All Staff', icon: School },
    { id: 'administration', label: 'Administration', icon: Business },
    { id: 'mathematics', label: 'Mathematics', icon: MenuBook },
    { id: 'science', label: 'Science', icon: Science },
    { id: 'english', label: 'English', icon: MenuBook },
    { id: 'social_studies', label: 'Social Studies', icon: MenuBook },
    { id: 'arts', label: 'Arts', icon: Palette },
    { id: 'athletics', label: 'Athletics', icon: EmojiEvents },
    { id: 'counseling', label: 'Counseling', icon: School },
    { id: 'health', label: 'Health Services', icon: LocalHospital },
  ];

  const filteredStaff = staffMembers.filter(member => {
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDepartment && matchesSearch;
  });

  const stats = [
    { label: 'Total Faculty', value: staffMembers.length },
    { label: 'Ph.D. Holders', value: staffMembers.filter(s => s.education.includes('Ph.D.')).length },
    { label: 'Departments', value: departments.length - 1 },
    { label: 'Avg. Experience', value: '11 years' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Staff Directory
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Meet our dedicated team of educators and staff members who are committed to 
            providing exceptional education and support to our students.
          </Typography>
        </Box>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid size={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <School />
                </Avatar>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
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

          <Paper>
            <Tabs
              value={selectedDepartment}
              onChange={(_, newValue) => setSelectedDepartment(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {departments.map((department) => {
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
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {filteredStaff.map((member) => (
              <Grid size={4} key={member.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                    />
                    <Typography variant="h6" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {member.position}
                    </Typography>
                    <Chip
                      label={departments.find(d => d.id === member.department)?.label || member.department}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Education:</strong> {member.education}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Experience:</strong> {member.experience}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Specializations:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {member.specializations.map((spec, index) => (
                          <Chip key={index} label={spec} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
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
          <Paper sx={{ p: 6, textAlign: 'center', mb: 6 }}>
            <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No staff members found matching your criteria.
            </Typography>
          </Paper>
        )}

        {/* Professional Development */}
        <Paper sx={{ p: 4, mb: 6, backgroundColor: 'grey.50' }}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Professional Excellence
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}
          >
            Our faculty members are committed to continuous professional development and 
            staying current with the latest educational practices and technologies.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid >
              <Chip
                label="Advanced Degrees"
                color="primary"
                sx={{ px: 2, py: 1 }}
              />
            </Grid>
            <Grid >
              <Chip
                label="Ongoing Training"
                color="secondary"
                sx={{ px: 2, py: 1 }}
              />
            </Grid>
            <Grid >
              <Chip
                label="Research & Innovation"
                color="success"
                sx={{ px: 2, py: 1 }}
              />
            </Grid>
            <Grid >
              <Chip
                label="Professional Certifications"
                color="info"
                sx={{ px: 2, py: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Contact Section */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom>
            Need to Reach Someone?
          </Typography>
          <Typography variant="h6" paragraph sx={{ maxWidth: '600px', mx: 'auto', opacity: 0.9 }}>
            If you need to contact a specific staff member or department, feel free to reach 
            out directly using the contact information provided, or contact our main office.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              Main Office: (555) 123-4567
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'grey.300',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Email Directory
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}