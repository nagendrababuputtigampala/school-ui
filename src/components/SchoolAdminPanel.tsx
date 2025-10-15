import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchSchoolData,
  updateHomePageContent,
  updateContactPageContent,
  updateAchievementsPageContent,
  updateStaffPageContent,
  updateAlumniPageContent,
  updateGalleryPageContent,
  updateAnnouncementsPageContent,
} from '../config/firebase';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Chip,
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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
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
  Edit,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

type PageType = 'home' | 'achievements' | 'staff' | 'alumni' | 'gallery' | 'announcements' | 'contact';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  level: string;
  sectionKey?: string;
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
  // Store school info for sidebar header
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [dirtyPage, setDirtyPage] = useState<'home' | 'contact' | 'both' | null>(null);
  const { schoolId } = useParams<{ schoolId: string }>();
  const [activePage, setActivePage] = useState<PageType>('home');
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [achievementDialog, setAchievementDialog] = useState(false);
  const [staffDialog, setStaffDialog] = useState(false);
  const [alumniDialog, setAlumniDialog] = useState(false);
  const [galleryDialog, setGalleryDialog] = useState(false);
  const [announcementDialog, setAnnouncementDialog] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniMember | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryImage | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Data states
  const [homeData, setHomeData] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [alumniMembers, setAlumniMembers] = useState<AlumniMember[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [contactData, setContactData] = useState<any>(null);
  const [achievementSectionsMeta, setAchievementSectionsMeta] = useState<Record<string, { title: string }>>({});
  const [principalMessageExpanded, setPrincipalMessageExpanded] = useState(false);
  const [homeErrors, setHomeErrors] = useState<{ yearEstablished?: string; successRate?: string }>({});
  const [contactErrors, setContactErrors] = useState<{ phone?: string; email?: string }>({});
const tableHeaderSx = { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: 'text.secondary' };
  const updateHomeField = (key: string, value: string) => {
    setHomeData((prev: any) => ({ ...(prev || {}), [key]: value }));
    if (key === 'yearEstablished') {
      const isValid = /^\d{0,4}$/.test(value) && (value === '' || Number(value) >= 1800);
      setHomeErrors((prev) => ({
        ...prev,
        yearEstablished: isValid ? undefined : 'Use a four-digit year (>=1800)',
      }));
    }
    if (key === 'successRate') {
      const cleaned = value.trim().replace('%', '');
      const numericValue = Number(cleaned);
      const isValid =
        cleaned === '' ||
        (!Number.isNaN(numericValue) && numericValue >= 0 && numericValue <= 100 && /^\d{1,3}(\.\d{1,2})?$/.test(cleaned));
      setHomeErrors((prev) => ({
        ...prev,
        successRate: isValid ? undefined : 'Enter 0-100 (up to two decimals)',
      }));
    }
    setDirtyPage((prev) => (prev === 'contact' || prev === 'both' ? 'both' : 'home'));
  };
  const updateContactField = (key: string, value: string) => {
    setContactData((prev: any) => ({ ...(prev || {}), [key]: value }));
    if (key === 'phone') {
      const phoneRegex = /^[\d+\-()\s]+$/;
      setContactErrors((prev) => ({
        ...prev,
        phone: value && !phoneRegex.test(value) ? 'Only digits, punctuation, + allowed' : undefined,
      }));
    }
    if (key === 'email') {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      setContactErrors((prev) => ({
        ...prev,
        email: value && !emailRegex.test(value) ? 'Enter a valid email address' : undefined,
      }));
    }
    setDirtyPage((prev) => (prev === 'home' || prev === 'both' ? 'both' : 'contact'));
  };

  const applySchoolData = useCallback((schoolData: any | null) => {
    if (!schoolData) {
      setSchoolInfo(null);
      setHomeData(null);
      setAchievements([]);
      setStaffMembers([]);
      setAlumniMembers([]);
      setGalleryImages([]);
      setAnnouncements([]);
      setContactData(null);
        setDirtyPage((prev) => (prev === 'both' ? 'contact' : null));
      return;
    }

    setSchoolInfo({
      id: schoolData.id,
      name: schoolData.name,
      slug: schoolData.slug,
      logo: schoolData.logo,
      primaryColor: schoolData.primaryColor,
      secondaryColor: schoolData.secondaryColor,
    });

    const pages = schoolData.pages || {};
    const homePage = pages.homePage || {};
    const principalSection = homePage.principalSection || {};
    const statisticsSection = homePage.statisticsSection || {};

    setHomeData({
      welcomeTitle: homePage.welcomeTitle || schoolData.welcomeTitle || '',
      welcomeSubTitle: homePage.welcomeSubtitle || schoolData.welcomeSubtitle || '',
      principalName: principalSection.name || homePage.principalName || '',
      principalMessage: principalSection.message || homePage.principalMessage || '',
      yearEstablished: statisticsSection.yearEstablished || schoolData.yearEstablished || '',
      students: statisticsSection.studentsCount || schoolData.studentsCount || '',
      successRate: statisticsSection.successRate || schoolData.successRate || '',
    });

    const achievementsPage = pages.achievementsPage || {};
    const sectionMeta: Record<string, { title: string }> = {};
    if (achievementsPage.academicSection) {
      sectionMeta.academicSection = {
        title: achievementsPage.academicSection.title || 'Academic Achievements',
      };
    }
    if (achievementsPage.sportsSection) {
      sectionMeta.sportsSection = {
        title: achievementsPage.sportsSection.title || 'Sports Achievements',
      };
    }
    if (achievementsPage.artsSection) {
      sectionMeta.artsSection = {
        title: achievementsPage.artsSection.title || 'Arts Achievements',
      };
    }
    setAchievementSectionsMeta(sectionMeta);
    const flattenAchievements = (section: any, fallbackLabel: string, sectionKey: string) => {
      if (!section) return [];
      const sectionLabel = section.title || fallbackLabel;
      const items = Array.isArray(section.achievements) ? section.achievements : [];
      return items.map((item: any, index: number) => ({
        id: item.id || `${fallbackLabel.toLowerCase()}-${index + 1}`,
        title: item.title || '',
        description: item.description || '',
        date: item.date || item.year || '',
        level: item.level || sectionLabel,
        sectionKey,
      }));
    };

    setAchievements([
      ...flattenAchievements(achievementsPage.academicSection, 'Academic', 'academicSection'),
      ...flattenAchievements(achievementsPage.sportsSection, 'Sports', 'sportsSection'),
      ...flattenAchievements(achievementsPage.artsSection, 'Arts', 'artsSection'),
    ]);

    const staffSource = Array.isArray(pages.staffPage?.staff) ? pages.staffPage?.staff : [];
    setStaffMembers(
      staffSource.map((staff: any, index: number) => ({
        id: staff.id || `staff-${index + 1}`,
        name: staff.name || '',
        department: staff.department || '',
        position: staff.position || '',
        education: staff.education || '',
        specializations: Array.isArray(staff.specializations)
          ? staff.specializations.join(', ')
          : staff.specializations || '',
        experience: staff.experience || '',
        email: staff.email || '',
        phone: staff.phone || '',
        imageUrl: staff.imageUrl || staff.image || '',
        schoolId: staff.schoolId || schoolData.id,
      }))
    );

    const alumniSource = Array.isArray(pages.alumniPage?.alumniMembers)
      ? pages.alumniPage.alumniMembers
      : [];
    setAlumniMembers(
      alumniSource.map((alumni: any, index: number) => ({
        id: alumni.id || `alumni-${index + 1}`,
        name: alumni.name || '',
        bio: alumni.bio || '',
        company: alumni.company || '',
        currentPosition: alumni.currentPosition || '',
        graduationYear: alumni.graduationYear || '',
        imageUrl: alumni.imageUrl || alumni.image || '',
        industry: alumni.industry || '',
        location: alumni.location || '',
        linkedinUrl: alumni.linkedinUrl || alumni.linkedIn || '',
        achievements: Array.isArray(alumni.achievements)
          ? alumni.achievements.join(', ')
          : alumni.achievements || '',
      }))
    );

    const galleryPage = pages.galleryPage || {};
    const galleryItems: GalleryImage[] = [];

    if (Array.isArray(galleryPage.galleryImages)) {
      galleryPage.galleryImages.forEach((image: any, index: number) => {
        const imageUrl = typeof image === 'string' ? image : image?.url || image?.imageUrl || '';
        if (!imageUrl) return;
        galleryItems.push({
          id: image.id || `gallery-${index + 1}`,
          title: image.title || `Image ${index + 1}`,
          category: image.category || 'Gallery',
          description: image.description || '',
          date: image.date || '',
          imageUrl,
        });
      });
    } else {
      Object.entries(galleryPage).forEach(([sectionKey, sectionValue]) => {
        const section = sectionValue as any;
        if (!Array.isArray(section?.images)) return;
        const sectionTitle = section.title || sectionKey;
        section.images.forEach((image: any, index: number) => {
          const imageUrl = typeof image === 'string' ? image : image?.url || image?.imageUrl || image?.src || '';
          if (!imageUrl) return;
          galleryItems.push({
            id: image.id || `${sectionKey}-${index + 1}`,
            title: image.title || `${sectionTitle} ${index + 1}`,
            category: sectionTitle,
            description: image.description || '',
            date: image.date || '',
            imageUrl,
          });
        });
      });
    }
    setGalleryImages(galleryItems);

    const rawAnnouncements = Array.isArray(pages.announcementsPage?.announcements)
      ? pages.announcementsPage.announcements
      : Array.isArray(homePage.announcementsSection?.recentUpdates)
        ? homePage.announcementsSection.recentUpdates
        : [];

    setAnnouncements(
      rawAnnouncements.map((announcement: any, index: number) => ({
        id: announcement.id || `announcement-${index + 1}`,
        title: announcement.title || '',
        description: announcement.description || '',
        date: announcement.date || '',
        category: announcement.category || '',
        priority: (announcement.priority || 'medium').toLowerCase(),
        type: (announcement.type || 'announcement').toLowerCase(),
      }))
    );

    const contactSource = pages.contactPage || schoolData.contactInfo || {};
    const normalizeArrayField = (value: any, joinWith: string) =>
      Array.isArray(value) ? value.join(joinWith) : value || '';

    setContactData({
      address: contactSource.address || '',
      phone: normalizeArrayField(contactSource.phone, ', '),
      email: normalizeArrayField(contactSource.email, ', '),
      officeHours: normalizeArrayField(contactSource.officeHours, '\n'),
    });
        setDirtyPage((prev) => (prev === 'both' ? 'home' : null));
  }, []);

  const fetchAllData = useCallback(async () => {
    const activeSchoolId = schoolId || 'educonnect';
    return fetchSchoolData(activeSchoolId);
  }, [schoolId]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyPage) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirtyPage]);

  // Fetch and prepopulate data from Firebase
  useEffect(() => {
    let isCancelled = false;

    fetchAllData()
      .then((data) => {
        if (!isCancelled) {
          applySchoolData(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load school data:', err);
        if (!isCancelled) {
          applySchoolData(null);
          setSnackbarSeverity('error');
          setSnackbarMessage('Failed to load school data.');
          setSnackbarOpen(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [applySchoolData, fetchAllData]);

  const getAchievementSectionLabel = (key: string) => {
    if (achievementSectionsMeta[key]) {
      return achievementSectionsMeta[key].title;
    }
    switch (key) {
      case 'academicSection':
        return 'Academic Achievements';
      case 'sportsSection':
        return 'Sports Achievements';
      case 'artsSection':
        return 'Arts Achievements';
      default:
        return 'General Achievements';
    }
  };

  const buildAchievementsUpdate = (achievementsList: Achievement[] = achievements) => {
    const sections: Record<string, { title: string; achievements: any[] }> = {};
    const meta = {
      academicSection: { title: 'Academic Achievements' },
      sportsSection: { title: 'Sports Achievements' },
      artsSection: { title: 'Arts Achievements' },
      ...achievementSectionsMeta,
    };

    Object.entries(meta).forEach(([key, value]) => {
      sections[key] = {
        title: value.title,
        achievements: [],
      };
    });

    achievementsList.forEach((item) => {
      const key = item.sectionKey && sections[item.sectionKey] ? item.sectionKey : 'academicSection';
      if (!sections[key]) {
        sections[key] = { title: key, achievements: [] };
      }
      sections[key].achievements.push({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        year: item.date,
        level: item.level,
      });
    });

    return sections;
  };

  const refreshSchoolData = useCallback(async () => {
    const refreshedData = await fetchAllData();
    if (refreshedData) {
      applySchoolData(refreshedData);
    }
  }, [applySchoolData, fetchAllData]);

  const handleSave = async () => {
    const targetSchoolId = schoolId || 'educonnect';

    try {
      setIsSaving(true);

      if (activePage === 'home' && homeData) {
        await updateHomePageContent(targetSchoolId, homeData);
        await refreshSchoolData();
        setDirtyPage((prev) => (prev === 'both' ? 'contact' : null));
        showSuccess('Home page saved successfully!');
      } else if (activePage === 'contact' && contactData) {
        await updateContactPageContent(targetSchoolId, contactData);
        await refreshSchoolData();
        setDirtyPage((prev) => (prev === 'both' ? 'home' : null));
        showSuccess('Contact information saved successfully!');
      } else {
        showError('Save is only available on the Home and Contact sections.');
        setIsSaving(false);
        return;
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      showError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const showSuccess = (message: string) => {
    setSnackbarSeverity('success');
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const showError = (message: string) => {
    setSnackbarSeverity('error');
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Achievement handlers
  const openAddAchievement = () => {
    setEditingAchievement({
      id: '',
      title: '',
      description: '',
      date: '',
      level: '',
      sectionKey: 'academicSection'
    });
    setAchievementDialog(true);
  };

  const openEditAchievement = (achievement: Achievement) => {
    setEditingAchievement({ ...achievement });
    setAchievementDialog(true);
  };

  const saveAchievement = async () => {
    if (!editingAchievement) return;
    const sectionKey = editingAchievement.sectionKey || 'academicSection';
    const achievementEntry: Achievement = {
      ...editingAchievement,
      sectionKey,
    };
    const updatedList = editingAchievement.id
      ? achievements.map((a: Achievement) => (a.id === editingAchievement.id ? achievementEntry : a))
      : [...achievements, { ...achievementEntry, id: Date.now().toString() }];
    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      const payload = buildAchievementsUpdate(updatedList);
      await updateAchievementsPageContent(targetSchoolId, payload);
      setAchievementDialog(false);
      setEditingAchievement(null);
      setAchievements(updatedList);
      await refreshSchoolData();
      showSuccess('Achievement saved successfully!');
    } catch (error) {
      console.error('Failed to save achievement:', error);
      showError('Failed to save achievement. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAchievement = async (id: string) => {
    const updatedList = achievements.filter((a: Achievement) => a.id !== id);
    setAchievements(updatedList);

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      const payload = buildAchievementsUpdate(updatedList);
      await updateAchievementsPageContent(targetSchoolId, payload);
      await refreshSchoolData();
      showSuccess('Achievement removed successfully!');
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      showError('Failed to delete achievement. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const openAddStaff = () => {
    setEditingStaff({
      id: '',
      name: '',
      department: '',
      position: '',
      education: '',
      specializations: '',
      experience: '',
      email: '',
      phone: '',
      imageUrl: '',
      schoolId: schoolInfo?.id || schoolId || '',
    });
    setStaffDialog(true);
  };

  const openEditStaff = (staff: StaffMember) => {
    setEditingStaff({ ...staff });
    setStaffDialog(true);
  };

  const saveStaffMember = async () => {
    if (!editingStaff) return;
    const staffEntry: StaffMember = {
      ...editingStaff,
      id: editingStaff.id || `staff-${Date.now()}`,
      schoolId: editingStaff.schoolId || schoolInfo?.id || schoolId || '',
    };
    const updatedList = editingStaff.id
      ? staffMembers.map((s) => (s.id === editingStaff.id ? staffEntry : s))
      : [...staffMembers, staffEntry];
    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateStaffPageContent(targetSchoolId, updatedList);
      setStaffDialog(false);
      setEditingStaff(null);
      setStaffMembers(updatedList);
      await refreshSchoolData();
      showSuccess('Staff member saved successfully!');
    } catch (error) {
      console.error('Failed to save staff member:', error);
      showError('Failed to save staff member. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStaffMember = async (id: string) => {
    const updatedList = staffMembers.filter((staff) => staff.id !== id);
    setStaffMembers(updatedList);

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateStaffPageContent(targetSchoolId, updatedList);
      await refreshSchoolData();
      showSuccess('Staff member removed.');
    } catch (error) {
      console.error('Failed to delete staff member:', error);
      showError('Failed to delete staff member. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const openAddAlumni = () => {
    setEditingAlumni({
      id: '',
      name: '',
      bio: '',
      company: '',
      currentPosition: '',
      graduationYear: '',
      imageUrl: '',
      industry: '',
      location: '',
      linkedinUrl: '',
      achievements: '',
    });
    setAlumniDialog(true);
  };

  const openEditAlumni = (alumni: AlumniMember) => {
    setEditingAlumni({ ...alumni });
    setAlumniDialog(true);
  };

  const saveAlumniMember = async () => {
    if (!editingAlumni) return;
    const alumniEntry: AlumniMember = {
      ...editingAlumni,
      id: editingAlumni.id || `alumni-${Date.now()}`,
    };
    const updatedList = editingAlumni.id
      ? alumniMembers.map((a) => (a.id === editingAlumni.id ? alumniEntry : a))
      : [...alumniMembers, alumniEntry];

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateAlumniPageContent(targetSchoolId, updatedList);
      setAlumniDialog(false);
      setEditingAlumni(null);
      setAlumniMembers(updatedList);
      await refreshSchoolData();
      showSuccess('Alumni entry saved successfully!');
    } catch (error) {
      console.error('Failed to save alumni entry:', error);
      showError('Failed to save alumni entry. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAlumniMember = async (id: string) => {
    const updatedList = alumniMembers.filter((alumni) => alumni.id !== id);
    setAlumniMembers(updatedList);

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateAlumniPageContent(targetSchoolId, updatedList);
      await refreshSchoolData();
      showSuccess('Alumni entry removed.');
    } catch (error) {
      console.error('Failed to delete alumni entry:', error);
      showError('Failed to delete alumni entry. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const openAddGalleryImage = () => {
    setEditingGallery({
      id: '',
      title: '',
      category: '',
      description: '',
      date: '',
      imageUrl: '',
    });
    setGalleryDialog(true);
  };

  const openEditGalleryImage = (image: GalleryImage) => {
    setEditingGallery({ ...image });
    setGalleryDialog(true);
  };

  const saveGalleryImage = async () => {
    if (!editingGallery) return;
    const galleryEntry: GalleryImage = {
      ...editingGallery,
      id: editingGallery.id || `gallery-${Date.now()}`,
    };
    const updatedList = editingGallery.id
      ? galleryImages.map((image) => (image.id === editingGallery.id ? galleryEntry : image))
      : [...galleryImages, galleryEntry];

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateGalleryPageContent(targetSchoolId, updatedList);
      setGalleryDialog(false);
      setEditingGallery(null);
      setGalleryImages(updatedList);
      await refreshSchoolData();
      showSuccess('Gallery item saved successfully!');
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      showError('Failed to save gallery item. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    const updatedList = galleryImages.filter((image) => image.id !== id);
    setGalleryImages(updatedList);

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateGalleryPageContent(targetSchoolId, updatedList);
      await refreshSchoolData();
      showSuccess('Gallery item removed.');
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
      showError('Failed to delete gallery item. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const openAddAnnouncement = () => {
    setEditingAnnouncement({
      id: '',
      title: '',
      description: '',
      date: '',
      category: '',
      priority: 'medium',
      type: 'announcement',
    });
    setAnnouncementDialog(true);
  };

  const openEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement({
      ...announcement,
      priority: (announcement.priority || 'medium').toLowerCase(),
      type: (announcement.type || 'announcement').toLowerCase(),
    });
    setAnnouncementDialog(true);
  };

  const saveAnnouncement = async () => {
    if (!editingAnnouncement) return;
    const announcementEntry: Announcement = {
      ...editingAnnouncement,
      id: editingAnnouncement.id || `announcement-${Date.now()}`,
      priority: (editingAnnouncement.priority || 'medium').toLowerCase(),
      type: (editingAnnouncement.type || 'announcement').toLowerCase(),
    };
    const updatedList = editingAnnouncement.id
      ? announcements.map((a) => (a.id === editingAnnouncement.id ? announcementEntry : a))
      : [...announcements, announcementEntry];

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateAnnouncementsPageContent(targetSchoolId, updatedList);
      setAnnouncementDialog(false);
      setEditingAnnouncement(null);
      setAnnouncements(updatedList);
      await refreshSchoolData();
      showSuccess('Announcement saved successfully!');
    } catch (error) {
      console.error('Failed to save announcement:', error);
      showError('Failed to save announcement. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAnnouncementItem = async (id: string) => {
    const updatedList = announcements.filter((announcement) => announcement.id !== id);
    setAnnouncements(updatedList);

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      await updateAnnouncementsPageContent(targetSchoolId, updatedList);
      await refreshSchoolData();
      showSuccess('Announcement removed.');
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      showError('Failed to delete announcement. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigation = (page: PageType) => {
    if (page === activePage) return;
    if (dirtyPage) {
      const pageLabel =
        dirtyPage === 'home' ? 'Home' : dirtyPage === 'contact' ? 'Contact' : 'Home and Contact';
      const shouldLeave = window.confirm(
        `You have unsaved changes on the ${pageLabel} page. Continue without saving?`
      );
      if (!shouldLeave) {
        return;
      }
      setDirtyPage(null);
      void refreshSchoolData();
    }
    setActivePage(page);
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
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            minHeight: '100vh',
            alignSelf: 'stretch',
            borderRight: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'width 0.3s ease'
          }}
        >
          <Box sx={{ p: sidebarCollapsed ? 1 : 3, borderBottom: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {!sidebarCollapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <School sx={{ fontSize: 32, color: 'primary.contrastText' }} />
                  <Box>
                    <Typography variant="h6" color="primary.contrastText">
                      {schoolInfo?.name || 'Admin Panel'}
                    </Typography>
                    {schoolInfo?.slug && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {schoolInfo.slug}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              {sidebarCollapsed && (
                <School sx={{ fontSize: 24, color: 'primary.contrastText', mx: 'auto' }} />
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
                    onClick={() => handleNavigation(item.id as PageType)}
                    selected={isActive}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      px: sidebarCollapsed ? 1.5 : 2,
                      py: 1.5,
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'primary.dark',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive ? 'inherit' : 'rgba(255,255,255,0.7)',
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
              bgcolor: 'primary.main',
              border: 1,
              borderColor: 'rgba(255,255,255,0.4)',
              width: 24,
              height: 24,
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
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
            {activePage === 'home' && homeData && (
              <Card>
                <CardHeader 
                  title={<Typography variant="h5">Home</Typography>}
                />
                <CardContent>
                    <Stack spacing={3}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexDirection: { xs: 'column', md: 'row' },
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>School Title</FormLabel>
                          <TextField
                            fullWidth
                            value={homeData?.welcomeTitle || ''}
                            onChange={(e) => updateHomeField('welcomeTitle', e.target.value)}
                            placeholder="Enter school title"
                            margin="dense"
                          />
                        </Box>
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>School Subtitle</FormLabel>
                          <TextField
                            fullWidth
                            value={homeData?.welcomeSubTitle || ''}
                            onChange={(e) => updateHomeField('welcomeSubTitle', e.target.value)}
                            placeholder="Enter school subtitle"
                            margin="dense"
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexDirection: { xs: 'column', md: 'row' },
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Principal Name</FormLabel>
                          <TextField
                            fullWidth
                            value={homeData?.principalName || ''}
                            onChange={(e) => updateHomeField('principalName', e.target.value)}
                            placeholder="Principal's name"
                            margin="dense"
                          />
                        </Box>
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Principal's Message</FormLabel>
                          <TextField
                            fullWidth
                            multiline
                            rows={principalMessageExpanded ? 6 : 3}
                            value={homeData?.principalMessage || ''}
                            onChange={(e) => {
                              const nextValue = e.target.value.slice(0, 500);
                              updateHomeField('principalMessage', nextValue);
                            }}
                            inputProps={{ maxLength: 500 }}
                            helperText={`${(homeData?.principalMessage || '').length}/500 characters`}
                            placeholder="Principal's message to students and parents"
                            margin="dense"
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              onClick={() => setPrincipalMessageExpanded((prev) => !prev)}
                              sx={{ textTransform: 'none' }}
                            >
                              {principalMessageExpanded ? 'Show Less' : 'Show More'}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: { xs: 2, md: 3 },
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box sx={{ flex: 1, width: '100%' }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Year Established</FormLabel>
                          <TextField
                            fullWidth
                            value={homeData?.yearEstablished || ''}
                            onChange={(e) => updateHomeField('yearEstablished', e.target.value)}
                            placeholder="e.g., 1995"
                            margin="dense"
                            error={Boolean(homeErrors.yearEstablished)}
                            helperText={homeErrors.yearEstablished}
                          />
                          </Box>
                          <Box sx={{ flex: 1, width: '100%' }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Total Students</FormLabel>
                          <TextField
                            fullWidth
                            value={homeData?.students || ''}
                            onChange={(e) => updateHomeField('students', e.target.value)}
                            placeholder="e.g., 2500+"
                            margin="dense"
                          />
                          </Box>
                          <Box sx={{ flex: 1, width: '100%' }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Success Rate</FormLabel>
                          <TextField
                            fullWidth
                            value={homeData?.successRate || ''}
                            onChange={(e) => updateHomeField('successRate', e.target.value)}
                            placeholder="e.g., 98%"
                            margin="dense"
                            error={Boolean(homeErrors.successRate)}
                            helperText={homeErrors.successRate}
                          />
                          </Box>
                        </Box>
                      </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                      <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        disabled={isSaving}
                        startIcon={
                          isSaving ? <CircularProgress size={16} color="inherit" /> : <Save />
                        }
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
                    disabled={isSaving}
                    startIcon={<Plus />}
                  >
                    Add Achievement
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderSx}>Title</TableCell>
                        <TableCell sx={tableHeaderSx}>Level</TableCell>
                        <TableCell sx={tableHeaderSx}>Date</TableCell>
                        <TableCell sx={tableHeaderSx}>Description</TableCell>
                        <TableCell sx={{ ...tableHeaderSx, textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {achievements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No achievements found. Use "Add Achievement" to create one.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {achievements.map((achievement) => (
                        <TableRow key={achievement.id}>
                          <TableCell>{achievement.title}</TableCell>
                          <TableCell>
                            <Chip sx={{ fontWeight: 600 }} label={achievement.level} size="small" />
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
                                disabled={isSaving}
                                onClick={() => openEditAchievement(achievement)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={isSaving}
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
                    onClick={openAddStaff}
                    disabled={isSaving}
                    startIcon={<Plus />}
                  >
                    Add Staff Member
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderSx}>Name</TableCell>
                        <TableCell sx={tableHeaderSx}>Department</TableCell>
                        <TableCell sx={tableHeaderSx}>Position</TableCell>
                        <TableCell sx={tableHeaderSx}>Experience</TableCell>
                        <TableCell sx={tableHeaderSx}>Email</TableCell>
                        <TableCell sx={{ ...tableHeaderSx, textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {staffMembers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No staff members found. Use "Add Staff Member" to create one.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {staffMembers.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>{staff.name}</TableCell>
                          <TableCell>
                            <Chip sx={{ fontWeight: 600 }} label={staff.department} size="small" />
                          </TableCell>
                          <TableCell>{staff.position}</TableCell>
                          <TableCell>{staff.experience}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                disabled={isSaving}
                                onClick={() => openEditStaff(staff)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={isSaving}
                                onClick={() => deleteStaffMember(staff.id)}
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
                    onClick={openAddAlumni}
                    disabled={isSaving}
                    startIcon={<Plus />}
                  >
                    Add Alumni
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderSx}>Name</TableCell>
                        <TableCell sx={tableHeaderSx}>Graduation Year</TableCell>
                        <TableCell sx={tableHeaderSx}>Current Position</TableCell>
                        <TableCell sx={tableHeaderSx}>Company</TableCell>
                        <TableCell sx={tableHeaderSx}>Industry</TableCell>
                        <TableCell sx={{ ...tableHeaderSx, textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alumniMembers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No alumni entries found. Use "Add Alumni" to create one.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {alumniMembers.map((alumni) => (
                        <TableRow key={alumni.id}>
                          <TableCell>{alumni.name}</TableCell>
                          <TableCell>{alumni.graduationYear}</TableCell>
                          <TableCell>{alumni.currentPosition}</TableCell>
                          <TableCell>{alumni.company}</TableCell>
                          <TableCell>
                            <Chip sx={{ fontWeight: 600 }} label={alumni.industry} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                disabled={isSaving}
                                onClick={() => openEditAlumni(alumni)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={isSaving}
                                onClick={() => deleteAlumniMember(alumni.id)}
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
                    onClick={openAddGalleryImage}
                    disabled={isSaving}
                    startIcon={<Plus />}
                  >
                    Add Image
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderSx}>Title</TableCell>
                        <TableCell sx={tableHeaderSx}>Category</TableCell>
                        <TableCell sx={tableHeaderSx}>Date</TableCell>
                        <TableCell sx={tableHeaderSx}>Description</TableCell>
                        <TableCell sx={{ ...tableHeaderSx, textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {galleryImages.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No gallery items found. Use "Add Image" to create one.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {galleryImages.map((image) => (
                        <TableRow key={image.id}>
                          <TableCell>{image.title}</TableCell>
                          <TableCell>
                            <Chip sx={{ fontWeight: 600 }} label={image.category} size="small" />
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
                                disabled={isSaving}
                                onClick={() => openEditGalleryImage(image)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={isSaving}
                                onClick={() => deleteGalleryImage(image.id)}
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
                    onClick={openAddAnnouncement}
                    disabled={isSaving}
                    startIcon={<Plus />}
                  >
                    Add Announcement
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderSx}>Title</TableCell>
                        <TableCell sx={tableHeaderSx}>Category</TableCell>
                        <TableCell sx={tableHeaderSx}>Priority</TableCell>
                        <TableCell sx={tableHeaderSx}>Date</TableCell>
                        <TableCell sx={tableHeaderSx}>Description</TableCell>
                        <TableCell sx={{ ...tableHeaderSx, textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {announcements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No announcements found. Use "Add Announcement" to create one.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {announcements.map((announcement) => (
                        <TableRow key={announcement.id}>
                          <TableCell>{announcement.title}</TableCell>
                          <TableCell>
                            <Chip sx={{ fontWeight: 600 }} label={announcement.category} size="small" />
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const priority = (announcement.priority || '').toLowerCase();
                              const chipColor =
                                priority === 'high'
                                  ? 'error'
                                  : priority === 'medium'
                                  ? 'warning'
                                  : 'default';
                              const priorityLabel = priority
                                ? priority.charAt(0).toUpperCase() + priority.slice(1)
                                : 'Low';
                              return (
                                <Chip 
                                  sx={{ fontWeight: 600 }}
                                  label={priorityLabel}
                                  size="small"
                                  color={chipColor}
                                />
                              );
                            })()}
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
                                disabled={isSaving}
                                onClick={() => openEditAnnouncement(announcement)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={isSaving}
                                onClick={() => deleteAnnouncementItem(announcement.id)}
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
            {activePage === 'contact' && contactData && (
              <Card>
                <CardHeader 
                  title={<Typography variant="h5">Contact Information</Typography>}
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>School Address</FormLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={contactData?.address || ''}
                        onChange={(e) => updateContactField('address', e.target.value)}
                        placeholder="Enter school address"
                        margin="dense"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Phone Number</FormLabel>
                        <TextField
                          fullWidth
                          value={contactData?.phone || ''}
                          onChange={(e) => updateContactField('phone', e.target.value)}
                          placeholder="Enter phone number"
                          margin="dense"
                          error={Boolean(contactErrors.phone)}
                          helperText={contactErrors.phone}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Email Address</FormLabel>
                        <TextField
                          fullWidth
                          value={contactData?.email || ''}
                          onChange={(e) => updateContactField('email', e.target.value)}
                          placeholder="Enter email address"
                          margin="dense"
                          error={Boolean(contactErrors.email)}
                          helperText={contactErrors.email}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <FormLabel sx={{ mb: 1, fontWeight: 600, display: 'block' }}>Office Hours</FormLabel>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={contactData?.officeHours || ''}
                        onChange={(e) => updateContactField('officeHours', e.target.value)}
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
              <FormControl fullWidth>
                <InputLabel id="achievement-section-label">Section</InputLabel>
                <Select
                  labelId="achievement-section-label"
                  value={editingAchievement.sectionKey || 'academicSection'}
                  label="Section"
                  onChange={(e) =>
                    setEditingAchievement({
                      ...editingAchievement,
                      sectionKey: e.target.value as string,
                    })
                  }
                >
                  {['academicSection', 'sportsSection', 'artsSection'].map((key) => (
                    <MenuItem key={key} value={key}>
                      {getAchievementSectionLabel(key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          <Button onClick={() => setAchievementDialog(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveAchievement}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingAchievement?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Staff Dialog */}
      <Dialog
        open={staffDialog}
        onClose={() => {
          setStaffDialog(false);
          setEditingStaff(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingStaff?.id ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
        <DialogContent>
          {editingStaff && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={editingStaff.name}
                onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                placeholder="Full name"
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Department"
                  value={editingStaff.department}
                  onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
                <TextField
                  fullWidth
                  label="Position"
                  value={editingStaff.position}
                  onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                  placeholder="e.g., Senior Teacher"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Experience"
                  value={editingStaff.experience}
                  onChange={(e) => setEditingStaff({ ...editingStaff, experience: e.target.value })}
                  placeholder="e.g., 10 years"
                />
                <TextField
                  fullWidth
                  label="Education"
                  value={editingStaff.education}
                  onChange={(e) => setEditingStaff({ ...editingStaff, education: e.target.value })}
                  placeholder="e.g., M.Ed"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  placeholder="name@school.edu"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  placeholder="+1 555 123 4567"
                />
              </Box>
              <TextField
                fullWidth
                label="Specializations (comma separated)"
                value={editingStaff.specializations}
                onChange={(e) => setEditingStaff({ ...editingStaff, specializations: e.target.value })}
                placeholder="Mathematics, Algebra"
              />
              <TextField
                fullWidth
                label="Profile Image URL"
                value={editingStaff.imageUrl}
                onChange={(e) => setEditingStaff({ ...editingStaff, imageUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setStaffDialog(false);
              setEditingStaff(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveStaffMember}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingStaff?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alumni Dialog */}
      <Dialog
        open={alumniDialog}
        onClose={() => {
          setAlumniDialog(false);
          setEditingAlumni(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingAlumni?.id ? 'Edit Alumni' : 'Add Alumni'}</DialogTitle>
        <DialogContent>
          {editingAlumni && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={editingAlumni.name}
                onChange={(e) => setEditingAlumni({ ...editingAlumni, name: e.target.value })}
                placeholder="Full name"
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={editingAlumni.bio}
                onChange={(e) => setEditingAlumni({ ...editingAlumni, bio: e.target.value })}
                placeholder="Short biography"
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Graduation Year"
                  value={editingAlumni.graduationYear}
                  onChange={(e) => setEditingAlumni({ ...editingAlumni, graduationYear: e.target.value })}
                  placeholder="e.g., 2010"
                />
                <TextField
                  fullWidth
                  label="Industry"
                  value={editingAlumni.industry}
                  onChange={(e) => setEditingAlumni({ ...editingAlumni, industry: e.target.value })}
                  placeholder="e.g., Technology"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Company"
                  value={editingAlumni.company}
                  onChange={(e) => setEditingAlumni({ ...editingAlumni, company: e.target.value })}
                  placeholder="Company name"
                />
                <TextField
                  fullWidth
                  label="Current Position"
                  value={editingAlumni.currentPosition}
                  onChange={(e) => setEditingAlumni({ ...editingAlumni, currentPosition: e.target.value })}
                  placeholder="e.g., Senior Engineer"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Location"
                  value={editingAlumni.location}
                  onChange={(e) => setEditingAlumni({ ...editingAlumni, location: e.target.value })}
                  placeholder="City, Country"
                />
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  value={editingAlumni.linkedinUrl}
                  onChange={(e) => setEditingAlumni({ ...editingAlumni, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/example"
                />
              </Box>
              <TextField
                fullWidth
                label="Key Achievements (comma separated)"
                value={editingAlumni.achievements}
                onChange={(e) => setEditingAlumni({ ...editingAlumni, achievements: e.target.value })}
                placeholder="Achievement 1, Achievement 2"
              />
              <TextField
                fullWidth
                label="Profile Image URL"
                value={editingAlumni.imageUrl}
                onChange={(e) => setEditingAlumni({ ...editingAlumni, imageUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlumniDialog(false);
              setEditingAlumni(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveAlumniMember}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingAlumni?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog
        open={galleryDialog}
        onClose={() => {
          setGalleryDialog(false);
          setEditingGallery(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingGallery?.id ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
        <DialogContent>
          {editingGallery && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={editingGallery.title}
                onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                placeholder="Gallery item title"
              />
              <TextField
                fullWidth
                label="Category"
                value={editingGallery.category}
                onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                placeholder="e.g., events, sports"
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={editingGallery.date}
                onChange={(e) => setEditingGallery({ ...editingGallery, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={editingGallery.imageUrl}
                onChange={(e) => setEditingGallery({ ...editingGallery, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editingGallery.description}
                onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                placeholder="Short description"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setGalleryDialog(false);
              setEditingGallery(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveGalleryImage}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingGallery?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog
        open={announcementDialog}
        onClose={() => {
          setAnnouncementDialog(false);
          setEditingAnnouncement(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingAnnouncement?.id ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
        <DialogContent>
          {editingAnnouncement && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={editingAnnouncement.title}
                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                placeholder="Announcement title"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editingAnnouncement.description}
                onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                placeholder="Announcement details"
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={editingAnnouncement.date}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Category"
                  value={editingAnnouncement.category}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value })}
                  placeholder="e.g., Event"
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel id="announcement-priority-label">Priority</InputLabel>
                <Select
                  labelId="announcement-priority-label"
                  value={(editingAnnouncement.priority || 'medium').toLowerCase()}
                  label="Priority"
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      priority: e.target.value as string,
                    })
                  }
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="announcement-type-label">Type</InputLabel>
                <Select
                  labelId="announcement-type-label"
                  value={(editingAnnouncement.type || 'announcement').toLowerCase()}
                  label="Type"
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      type: e.target.value as string,
                    })
                  }
                >
                  <MenuItem value="announcement">Announcement</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                  <MenuItem value="news">News</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAnnouncementDialog(false);
              setEditingAnnouncement(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveAnnouncement}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingAnnouncement?.id ? 'Update' : 'Add'}
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
