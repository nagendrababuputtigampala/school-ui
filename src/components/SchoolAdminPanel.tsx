import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Snackbar,
  Alert,
  FormLabel,
  Stack
} from '@mui/material';
import {
  Save,
  School,
  Home,
  EmojiEvents as Trophy,
  People as Users,
  School as GraduationCap,
  Image as ImageIcon,
  Campaign as Megaphone,
  Mail,
  Add as Plus,
  Delete as Trash2,
  CloudUpload as Upload,
  Edit,
  Close as X,
  ChevronLeft,
  ChevronRight,
  PushPin as Pin,
  PushPinOutlined as PinOff
} from '@mui/icons-material';

type PageType = 'home' | 'achievements' | 'staff' | 'alumni' | 'gallery' | 'announcements' | 'contact';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  level: string;
}

interface StaffMember {
  id: string;
  name: string;
  department: string;
  position: string;
  education: string;
  specializations: string;
  experience: string;
  email: string;
  phone: string;
  imageUrl: string;
  schoolId: string;
}

interface AlumniMember {
  id: string;
  name: string;
  bio: string;
  company: string;
  currentPosition: string;
  graduationYear: string;
  imageUrl: string;
  industry: string;
  location: string;
  linkedinUrl: string;
  achievements: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  priority: string;
  type: string;
}

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  imageUrl: string;
}

export function SchoolAdminPanel() {
  const [activePage, setActivePage] = useState<PageType>('home');
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(true);

  // Dialog states
  const [achievementDialog, setAchievementDialog] = useState(false);
  const [staffDialog, setStaffDialog] = useState(false);
  const [alumniDialog, setAlumniDialog] = useState(false);
  const [galleryDialog, setGalleryDialog] = useState(false);
  const [announcementDialog, setAnnouncementDialog] = useState(false);

  // Edit states
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniMember | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryImage | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Home Page Data
  const [homeData, setHomeData] = useState({
    schoolTitle: 'Welcome to Greenwood High',
    schoolSubtitle: 'Nurturing Excellence, Building Future Leaders',
    principalMessage: 'Welcome to Greenwood High. We are dedicated to providing a nurturing environment where every student can thrive and reach their full potential.',
    principalName: 'Dr. Sarah Johnson',
    yearEstablished: '1995',
    students: '2500+',
    successRate: '98%'
  });

  // Achievements Data
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'National Science Olympiad - Gold Medal', description: 'Our students won the gold medal in the National Science Olympiad 2024', date: '2024-03-15', level: 'National' },
    { id: '2', title: 'State Basketball Championship', description: 'School basketball team won the state championship', date: '2024-02-20', level: 'State' },
    { id: '3', title: 'Best School Award 2023', description: 'Awarded the Best School in the region for academic excellence', date: '2023-12-10', level: 'Regional' }
  ]);

  // Staff Data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: '1', name: 'Dr. Sarah Johnson', department: 'Administration', position: 'Principal', education: 'Ph.D. in Education', specializations: 'Educational Leadership', experience: '25 years', email: 'principal@greenwoodhigh.edu', phone: '+91 98765 43210', imageUrl: '', schoolId: 'greenwood-high' },
    { id: '2', name: 'Mr. Rajesh Kumar', department: 'Administration', position: 'Vice Principal', education: 'M.Ed', specializations: 'School Management', experience: '20 years', email: 'vp@greenwoodhigh.edu', phone: '+91 98765 43211', imageUrl: '', schoolId: 'greenwood-high' },
    { id: '3', name: 'Mrs. Priya Sharma', department: 'Mathematics', position: 'Senior Teacher', education: 'M.Sc. Mathematics', specializations: 'Algebra, Calculus', experience: '15 years', email: 'priya@greenwoodhigh.edu', phone: '+91 98765 43212', imageUrl: '', schoolId: 'greenwood-high' }
  ]);

  // Alumni Data
  const [alumniMembers, setAlumniMembers] = useState<AlumniMember[]>([
    { id: '1', name: 'Arjun Mehta', bio: 'Software engineer with a passion for AI and machine learning', company: 'Google', currentPosition: 'Software Engineer', graduationYear: '2010', imageUrl: '', industry: 'Technology', location: 'San Francisco, USA', linkedinUrl: 'https://linkedin.com/in/arjunmehta', achievements: 'Leading AI research projects at Google' },
    { id: '2', name: 'Sneha Reddy', bio: 'Cardiologist dedicated to improving heart health outcomes', company: 'Apollo Hospitals', currentPosition: 'Medical Doctor', graduationYear: '2012', imageUrl: '', industry: 'Healthcare', location: 'Bangalore, India', linkedinUrl: 'https://linkedin.com/in/snehareddy', achievements: 'Pioneering work in cardiology' },
    { id: '3', name: 'Vikram Singh', bio: 'Tech entrepreneur and startup founder', company: 'TechStart Inc.', currentPosition: 'CEO & Founder', graduationYear: '2008', imageUrl: '', industry: 'Technology', location: 'Mumbai, India', linkedinUrl: 'https://linkedin.com/in/vikramsingh', achievements: 'Founded successful tech startup valued at $50M' }
  ]);

  // Gallery Data
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: '1', title: 'Annual Day 2024', category: 'Events', description: 'Students performing at the annual day celebration', date: '2024-03-20', imageUrl: '' },
    { id: '2', title: 'Science Lab', category: 'Infrastructure', description: 'State-of-the-art science laboratory', date: '2024-01-15', imageUrl: '' },
    { id: '3', title: 'Sports Day', category: 'Sports', description: 'Athletes competing in the inter-house sports competition', date: '2024-02-10', imageUrl: '' }
  ]);

  // Announcements Data
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', title: 'Admissions Open for 2025-26', description: 'We are now accepting applications for the academic year 2025-26. Visit the school office or apply online.', date: '2025-01-15', category: 'Admissions', priority: 'High', type: 'General' },
    { id: '2', title: 'Annual Day Celebration', description: 'Annual day celebration will be held on March 20, 2025. Parents are cordially invited.', date: '2025-01-10', category: 'Events', priority: 'Medium', type: 'Event' },
    { id: '3', title: 'Parent-Teacher Meeting', description: 'PTM scheduled for all classes on February 5, 2025 from 9 AM to 1 PM.', date: '2025-01-05', category: 'Academic', priority: 'High', type: 'Meeting' }
  ]);

  // Contact Data
  const [contactData, setContactData] = useState({
    address: '123 Education Street, Green Park, Bangalore, Karnataka - 560001',
    phone: '+91 80 1234 5678',
    email: 'contact@greenwoodhigh.edu',
    officeHours: 'Monday to Friday: 8:00 AM - 4:00 PM\nSaturday: 8:00 AM - 1:00 PM'
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    showSuccess(`${activePage.charAt(0).toUpperCase() + activePage.slice(1)} page updated successfully!`);
  };

  const showSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Achievement handlers
  const openAddAchievement = () => {
    setEditingAchievement({ id: '', title: '', description: '', date: '', level: '' });
    setAchievementDialog(true);
  };

  const openEditAchievement = (achievement: Achievement) => {
    setEditingAchievement({ ...achievement });
    setAchievementDialog(true);
  };

  const saveAchievement = () => {
    if (!editingAchievement) return;
    
    if (editingAchievement.id) {
      setAchievements(achievements.map(a => a.id === editingAchievement.id ? editingAchievement : a));
      showSuccess('Achievement updated successfully!');
    } else {
      setAchievements([...achievements, { ...editingAchievement, id: Date.now().toString() }]);
      showSuccess('Achievement added successfully!');
    }
    setAchievementDialog(false);
    setEditingAchievement(null);
  };

  const deleteAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
    showSuccess('Achievement deleted successfully!');
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'staff', label: 'Staff Details', icon: Users },
    { id: 'alumni', label: 'Alumni', icon: GraduationCap },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'contact', label: 'Contact Us', icon: Mail }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar Navigation */}
        <Box
          sx={{
            width: sidebarCollapsed ? 64 : 256,
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'width 0.3s ease'
          }}
        >
          <Box sx={{ p: sidebarCollapsed ? 1 : 3, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {!sidebarCollapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <School sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6" color="text.primary">Admin Panel</Typography>
                    <Typography variant="body2" color="text.secondary">Greenwood High</Typography>
                  </Box>
                </Box>
              )}
              {sidebarCollapsed && (
                <School sx={{ fontSize: 24, color: 'primary.main', mx: 'auto' }} />
              )}
            </Box>
          </Box>
          
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List sx={{ p: sidebarCollapsed ? 1 : 2 }}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                
                const navButton = (
                  <ListItemButton
                    key={item.id}
                    onClick={() => setActivePage(item.id as PageType)}
                    selected={isActive}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      px: sidebarCollapsed ? 1.5 : 2,
                      py: 1.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive ? 'inherit' : 'text.secondary',
                      minWidth: sidebarCollapsed ? 'auto' : 40
                    }}>
                      <Icon />
                    </ListItemIcon>
                    {!sidebarCollapsed && (
                      <ListItemText 
                        primary={item.label}
                        sx={{ 
                          '& .MuiTypography-root': {
                            fontWeight: isActive ? 600 : 400
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                );
                
                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.id} title={item.label} placement="right">
                      {navButton}
                    </Tooltip>
                  );
                }
                
                return navButton;
              })}
            </List>
          </Box>

          {/* Collapse/Expand Button */}
          <IconButton
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            sx={{
              position: 'absolute',
              top: '50%',
              right: -12,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              width: 24,
              height: 24,
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
            {/* Home Page */}
            {activePage === 'home' && (
              <Card>
                <CardHeader 
                  title={<Typography variant="h5">Home</Typography>}
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>School Title</FormLabel>
                        <TextField
                          fullWidth
                          value={homeData.schoolTitle}
                          onChange={(e) => setHomeData({ ...homeData, schoolTitle: e.target.value })}
                          placeholder="Enter school title"
                          margin="dense"
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>School Subtitle</FormLabel>
                        <TextField
                          fullWidth
                          value={homeData.schoolSubtitle}
                          onChange={(e) => setHomeData({ ...homeData, schoolSubtitle: e.target.value })}
                          placeholder="Enter school subtitle"
                          margin="dense"
                        />
                      </Box>
                    </Box>
                    
                    <Divider />

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>Principal Name</FormLabel>
                        <TextField
                          fullWidth
                          value={homeData.principalName}
                          onChange={(e) => setHomeData({ ...homeData, principalName: e.target.value })}
                          placeholder="Principal's name"
                          margin="dense"
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>Principal's Message</FormLabel>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          value={homeData.principalMessage}
                          onChange={(e) => setHomeData({ ...homeData, principalMessage: e.target.value })}
                          placeholder="Principal's message to students and parents"
                          margin="dense"
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>Year Established</FormLabel>
                        <TextField
                          fullWidth
                          value={homeData.yearEstablished}
                          onChange={(e) => setHomeData({ ...homeData, yearEstablished: e.target.value })}
                          placeholder="e.g., 1995"
                          margin="dense"
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>Total Students</FormLabel>
                        <TextField
                          fullWidth
                          value={homeData.students}
                          onChange={(e) => setHomeData({ ...homeData, students: e.target.value })}
                          placeholder="e.g., 2500+"
                          margin="dense"
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>Success Rate</FormLabel>
                        <TextField
                          fullWidth
                          value={homeData.successRate}
                          onChange={(e) => setHomeData({ ...homeData, successRate: e.target.value })}
                          placeholder="e.g., 98%"
                          margin="dense"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                      <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        disabled={isSaving}
                        startIcon={<Save />}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Achievements Page */}
            {activePage === 'achievements' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>Achievements</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage school achievements, awards, and recognitions
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={openAddAchievement}
                    startIcon={<Plus />}
                  >
                    Add Achievement
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {achievements.map((achievement) => (
                        <TableRow key={achievement.id}>
                          <TableCell>{achievement.title}</TableCell>
                          <TableCell>
                            <Chip label={achievement.level} size="small" />
                          </TableCell>
                          <TableCell>{achievement.date}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="body2" noWrap>
                              {achievement.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                onClick={() => openEditAchievement(achievement)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => deleteAchievement(achievement.id)}
                              >
                                <Trash2 />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Staff Directory Page */}
            {activePage === 'staff' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>Staff Directory</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage staff members and their information
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={() => setStaffDialog(true)}
                    startIcon={<Plus />}
                  >
                    Add Staff Member
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Experience</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {staffMembers.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>{staff.name}</TableCell>
                          <TableCell>
                            <Chip label={staff.department} size="small" />
                          </TableCell>
                          <TableCell>{staff.position}</TableCell>
                          <TableCell>{staff.experience}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                onClick={() => setEditingStaff(staff)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setStaffMembers(staffMembers.filter(s => s.id !== staff.id))}
                              >
                                <Trash2 />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Alumni Page */}
            {activePage === 'alumni' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>Alumni</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage alumni information and achievements
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={() => setAlumniDialog(true)}
                    startIcon={<Plus />}
                  >
                    Add Alumni
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Graduation Year</TableCell>
                        <TableCell>Current Position</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Industry</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alumniMembers.map((alumni) => (
                        <TableRow key={alumni.id}>
                          <TableCell>{alumni.name}</TableCell>
                          <TableCell>{alumni.graduationYear}</TableCell>
                          <TableCell>{alumni.currentPosition}</TableCell>
                          <TableCell>{alumni.company}</TableCell>
                          <TableCell>
                            <Chip label={alumni.industry} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                onClick={() => setEditingAlumni(alumni)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setAlumniMembers(alumniMembers.filter(a => a.id !== alumni.id))}
                              >
                                <Trash2 />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Gallery Page */}
            {activePage === 'gallery' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>Gallery</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage school gallery images and media
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={() => setGalleryDialog(true)}
                    startIcon={<Plus />}
                  >
                    Add Image
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {galleryImages.map((image) => (
                        <TableRow key={image.id}>
                          <TableCell>{image.title}</TableCell>
                          <TableCell>
                            <Chip label={image.category} size="small" />
                          </TableCell>
                          <TableCell>{image.date}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="body2" noWrap>
                              {image.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                onClick={() => setEditingGallery(image)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setGalleryImages(galleryImages.filter(g => g.id !== image.id))}
                              >
                                <Trash2 />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Announcements Page */}
            {activePage === 'announcements' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" gutterBottom>Announcements</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage school announcements and notices
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    onClick={() => setAnnouncementDialog(true)}
                    startIcon={<Plus />}
                  >
                    Add Announcement
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {announcements.map((announcement) => (
                        <TableRow key={announcement.id}>
                          <TableCell>{announcement.title}</TableCell>
                          <TableCell>
                            <Chip label={announcement.category} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={announcement.priority} 
                              size="small" 
                              color={announcement.priority === 'High' ? 'error' : announcement.priority === 'Medium' ? 'warning' : 'default'}
                            />
                          </TableCell>
                          <TableCell>{announcement.date}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="body2" noWrap>
                              {announcement.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                onClick={() => setEditingAnnouncement(announcement)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setAnnouncements(announcements.filter(a => a.id !== announcement.id))}
                              >
                                <Trash2 />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Contact Page */}
            {activePage === 'contact' && (
              <Card>
                <CardHeader 
                  title={<Typography variant="h5">Contact Information</Typography>}
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <FormLabel>School Address</FormLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={contactData.address}
                        onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                        placeholder="Enter school address"
                        margin="dense"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>Phone Number</FormLabel>
                        <TextField
                          fullWidth
                          value={contactData.phone}
                          onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                          placeholder="Enter phone number"
                          margin="dense"
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel>Email Address</FormLabel>
                        <TextField
                          fullWidth
                          value={contactData.email}
                          onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                          placeholder="Enter email address"
                          margin="dense"
                        />
                      </Box>
                    </Box>
                    
                    <Box>
                      <FormLabel>Office Hours</FormLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={contactData.officeHours}
                        onChange={(e) => setContactData({ ...contactData, officeHours: e.target.value })}
                        placeholder="Enter office hours"
                        margin="dense"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                      <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        disabled={isSaving}
                        startIcon={<Save />}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>

      {/* Achievement Dialog */}
      <Dialog 
        open={achievementDialog} 
        onClose={() => setAchievementDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAchievement?.id ? 'Edit Achievement' : 'Add Achievement'}
        </DialogTitle>
        <DialogContent>
          {editingAchievement && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editingAchievement.title}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                  placeholder="Achievement title"
                />
                <TextField
                  fullWidth
                  label="Level"
                  value={editingAchievement.level}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, level: e.target.value })}
                  placeholder="e.g., National, State, Regional"
                />
              </Box>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editingAchievement.description}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                placeholder="Describe the achievement"
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={editingAchievement.date}
                onChange={(e) => setEditingAchievement({ ...editingAchievement, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAchievementDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveAchievement}>
            {editingAchievement?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}