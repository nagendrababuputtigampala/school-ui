import { useState, useEffect, useCallback, ReactElement, ChangeEvent } from 'react';
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
import { uploadImageToCloudinary } from '../config/cloudinary';
import { useAuth } from '../contexts/AuthContext';
import { UserManagement } from './UserManagement';
import {
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Avatar,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
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
  ChevronRight,
  ExpandMore,
  LocationOn,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  AccessTime,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  PhotoCamera,
  CloudUpload,
  Public,
  Star,
  TrendingUp,
  WorkspacePremium,
  PlayCircleOutline,
  SupervisorAccount,
} from '@mui/icons-material';
import {
  ANNOUNCEMENT_CATEGORY_OPTIONS,
  formatAnnouncementCategoryLabel,
  normalizeAnnouncementCategoryList,
} from '../config/announcementCategories';

const GALLERY_CATEGORY_OPTIONS = [
  { value: 'Academics', label: 'Academics', aliases: ['academic', 'academics'] },
  { value: 'Sports', label: 'Sports', aliases: ['sport', 'athletics', 'games'] },
  { value: 'Cultural', label: 'Cultural', aliases: ['culture', 'arts', 'events', 'event', 'festivals'] },
  { value: 'Students & Campus Life', label: 'Students & Campus Life', aliases: ['students', 'student', 'campus', 'campus life', 'student life'] },
  { value: 'Infrastructure', label: 'Infrastructure', aliases: ['facility', 'facilities', 'infrastructure', 'buildings'] },
  { value: 'Others', label: 'Others', aliases: ['other', 'misc', 'gallery', 'general'] },
] as const;

const canonicalizeGalleryCategory = (value: string) =>
  value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

const galleryCategoryLookup: Record<string, string> = (() => {
  const lookup: Record<string, string> = {};
  GALLERY_CATEGORY_OPTIONS.forEach((option) => {
    lookup[canonicalizeGalleryCategory(option.value)] = option.label;
    option.aliases?.forEach((alias) => {
      lookup[canonicalizeGalleryCategory(alias)] = option.label;
    });
  });
  return lookup;
})();

const defaultGalleryCategory = 'Others';
const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB limit for uploads

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_REGEX = /^[\d+\-()\s]+$/;
const GRADUATION_YEAR_REGEX = /^\d{4}$/;
const LINKEDIN_URL_REGEX = /^https?:\/\//i;

const resolveGalleryCategoryLabel = (value?: string, fallback?: string): string => {
  const attempt = (candidate?: string) => {
    if (!candidate) return null;
    const normalized = canonicalizeGalleryCategory(candidate);
    return galleryCategoryLookup[normalized] || null;
  };
  return attempt(value) || attempt(fallback) || defaultGalleryCategory;
};

const getGalleryCategoryLabel = (value?: string) =>
  resolveGalleryCategoryLabel(value, defaultGalleryCategory);

type PageType = 'home' | 'achievements' | 'staff' | 'alumni' | 'gallery' | 'announcements' | 'contact' | 'users';

const ACHIEVEMENT_SECTION_ORDER = [
  { key: 'general', title: 'General' },
  { key: 'academics', title: 'Academic' },
  { key: 'arts', title: 'Arts' },
  { key: 'sports', title: 'Sports' },
  { key: 'community', title: 'Community' },
  { key: 'cultural', title: 'Cultural' },
  { key: 'others', title: 'Other' },
] as const;

const defaultAchievementSections = ACHIEVEMENT_SECTION_ORDER.reduce<Record<string, { title: string }>>(
  (acc, { key, title }) => {
    acc[key] = { title };
    return acc;
  },
  {}
);

const capitalize = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : '');

const normalizeAchievementSectionKey = (rawKey: string | undefined): string => {
  const key = (rawKey || '').toLowerCase();
  if (!key) return 'general';
  if (['generalsection', 'general'].includes(key)) return 'general';
  if (['academicsection', 'academics', 'academic'].includes(key)) return 'academics';
  if (['artssection', 'art'].includes(key)) return 'arts';
  if (['sportssection', 'sport'].includes(key)) return 'sports';
  if (['communitysection', 'communityservice', 'service'].includes(key)) return 'community';
  if (['culturalsection', 'culture'].includes(key)) return 'cultural';
  if (['other', 'othersection'].includes(key)) return 'others';
  if (defaultAchievementSections[key]) return key;
  return key;
};

const normalizeHomeHeroImages = (raw: any): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === 'string' ? item.trim() : String(item || '').trim()))
      .filter((item) => item.length > 0);
  }
  if (typeof raw === 'object') {
    return Object.values(raw)
      .map((item) => (typeof item === 'string' ? item.trim() : String(item || '').trim()))
      .filter((item) => item.length > 0);
  }
  if (typeof raw === 'string') {
    return raw.trim() ? [raw.trim()] : [];
  }
  return [];
};

const extractVideoUrl = (value: any): string => {
  if (!value) return '';
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === 'string' && item.trim().length > 0);
    return typeof first === 'string' ? first.trim() : '';
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'object') {
    return extractVideoUrl(
      value.videoUrl || value.videoUrls || value.video || value.url || value.link || value.src
    );
  }
  return '';
};

const isValidYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('youtube.com')) {
      if (
        parsed.pathname.startsWith('/embed/') ||
        parsed.pathname.startsWith('/shorts/') ||
        parsed.pathname.startsWith('/live/')
      ) {
        return true;
      }
      return Boolean(parsed.searchParams.get('v')) || parsed.pathname.startsWith('/watch');
    }
    if (host === 'youtu.be') {
      return parsed.pathname.length > 1;
    }
    return false;
  } catch {
    return false;
  }
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  level: string;
  sectionKey?: string;
  sectionTitle?: string;
  image: string;
  schoolId?: string;
}

type AchievementFormErrors = {
  title?: string;
  description?: string;
  date?: string;
};

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
  image: string;
  schoolId: string;
}

type StaffFormErrors = {
  name?: string;
  department?: string;
  position?: string;
  education?: string;
  experience?: string;
  specializations?: string;
  email?: string;
  phone?: string;
};

interface AlumniMember {
  id: string;
  name: string;
  company: string;
  currentPosition: string;
  graduationYear: string;
  image: string;
  industry: string;
  location: string;
  linkedinUrl: string;
}

type AlumniFormErrors = {
  name?: string;
  graduationYear?: string;
  linkedinUrl?: string;
};

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  priority: string;
  type: string;
  isPinned: boolean;
  isUrgent: boolean;
  audience: string
  author: string;
  tags: string[];
}

type AnnouncementFormErrors = {
  title?: string;
  description?: string;
};

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  images: string[];
  videoUrl?: string;
  type?: string;
}

type GalleryFormErrors = {
  title?: string;
  description?: string;
  videoUrl?: string;
};

interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

const parseJourneyYear = (value: string): number | null => {
  const match = value.match(/\d{4}/);
  if (!match) return null;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const sortJourneyMilestones = (items: JourneyMilestone[]) =>
  [...items].sort((a, b) => {
    const yearA = parseJourneyYear(a.year);
    const yearB = parseJourneyYear(b.year);

    if (yearA !== null && yearB !== null && yearA !== yearB) {
      return yearB - yearA;
    }

    if (yearA === null && yearB !== null) {
      return 1;
    }

    if (yearB === null && yearA !== null) {
      return -1;
    }

    return a.title.localeCompare(b.title);
  });

export function SchoolAdminPanel() {
  // Auth context for user permissions
  const { userProfile } = useAuth();
  
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
  const [journeyDialog, setJourneyDialog] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [achievementErrors, setAchievementErrors] = useState<AchievementFormErrors>({});
  const [staffErrors, setStaffErrors] = useState<StaffFormErrors>({});
  const [alumniErrors, setAlumniErrors] = useState<AlumniFormErrors>({});
  const [galleryErrors, setGalleryErrors] = useState<GalleryFormErrors>({});
  const [announcementErrors, setAnnouncementErrors] = useState<AnnouncementFormErrors>({});
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniMember | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryImage | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingJourney, setEditingJourney] = useState<JourneyMilestone | null>(null);

  // Data states
  const [homeData, setHomeData] = useState<any>(null);
  const [journeyMilestones, setJourneyMilestones] = useState<JourneyMilestone[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [alumniMembers, setAlumniMembers] = useState<AlumniMember[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [contactData, setContactData] = useState<any>(null);
  const [principalPhotoFileName, setPrincipalPhotoFileName] = useState<string>('');
  const [principalPhotoUploading, setPrincipalPhotoUploading] = useState<boolean>(false);
  const [homeHeroImagesSaving, setHomeHeroImagesSaving] = useState<boolean>(false);
  const [homeHeroUploadStatus, setHomeHeroUploadStatus] = useState<string>('');
  const [staffPhotoFileName, setStaffPhotoFileName] = useState<string>('');
  const [pendingStaffPhotoFile, setPendingStaffPhotoFile] = useState<File | null>(null);
  const [staffPhotoPreviewUrl, setStaffPhotoPreviewUrl] = useState<string>('');
  const [staffPhotoUploading, setStaffPhotoUploading] = useState<boolean>(false);
  const [achievementPhotoFileName, setAchievementPhotoFileName] = useState<string>('');
  const [pendingAchievementPhotoFile, setPendingAchievementPhotoFile] = useState<File | null>(null);
  const [achievementPhotoPreviewUrl, setAchievementPhotoPreviewUrl] = useState<string>('');
  const [achievementPhotoUploading, setAchievementPhotoUploading] = useState<boolean>(false);
  const [alumniPhotoFileName, setAlumniPhotoFileName] = useState<string>('');
  const [pendingAlumniPhotoFile, setPendingAlumniPhotoFile] = useState<File | null>(null);
  const [alumniPhotoPreviewUrl, setAlumniPhotoPreviewUrl] = useState<string>('');
  const [alumniPhotoUploading, setAlumniPhotoUploading] = useState<boolean>(false);
  const [galleryPhotoFileNames, setGalleryPhotoFileNames] = useState<string[]>([]);
  const [pendingGalleryPhotoFiles, setPendingGalleryPhotoFiles] = useState<File[]>([]);
  const [galleryPhotoPreviewUrls, setGalleryPhotoPreviewUrls] = useState<string[]>([]);
  const [galleryPhotoUploading, setGalleryPhotoUploading] = useState<boolean>(false);
  const [achievementSectionsMeta, setAchievementSectionsMeta] =
    useState<Record<string, { title: string }>>(defaultAchievementSections);
  const [editingField, setEditingField] = useState<{ section: 'home' | 'contact'; key: string } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [expandedHomeSection, setExpandedHomeSection] = useState<string>('overview');
  const tableHeaderSx = { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: 'text.secondary' };

  const hasPendingStaffPhotoSelection = Boolean(pendingStaffPhotoFile || staffPhotoPreviewUrl);
  const hasExistingStaffPhoto = Boolean(editingStaff?.image);
  const staffPhotoChooseDisabled =
    isSaving || staffPhotoUploading || (hasExistingStaffPhoto && !hasPendingStaffPhotoSelection);
  const staffPhotoRemoveDisabled =
    staffPhotoUploading || isSaving || (!hasExistingStaffPhoto && !hasPendingStaffPhotoSelection);
  const hasPendingAlumniPhotoSelection = Boolean(pendingAlumniPhotoFile || alumniPhotoPreviewUrl);
  const hasExistingAlumniPhoto = Boolean(editingAlumni?.image);
  const alumniPhotoChooseDisabled =
    isSaving || alumniPhotoUploading || (hasExistingAlumniPhoto && !hasPendingAlumniPhotoSelection);
  const alumniPhotoRemoveDisabled =
    alumniPhotoUploading || isSaving || (!hasExistingAlumniPhoto && !hasPendingAlumniPhotoSelection);
  const hasExistingGalleryPhoto = Boolean(editingGallery?.images && editingGallery.images.length > 0);
  const galleryPhotoChooseDisabled = isSaving || galleryPhotoUploading;
  const galleryPhotoRemoveDisabled = galleryPhotoUploading || isSaving;
  const hasPendingAchievementPhotoSelection = Boolean(pendingAchievementPhotoFile || achievementPhotoPreviewUrl);
  const hasExistingAchievementPhoto = Boolean(editingAchievement?.image);
  const achievementPhotoChooseDisabled =
    isSaving || achievementPhotoUploading || (hasExistingAchievementPhoto && !hasPendingAchievementPhotoSelection);
  const achievementPhotoRemoveDisabled =
    achievementPhotoUploading || isSaving || (!hasExistingAchievementPhoto && !hasPendingAchievementPhotoSelection);
  

  const getAchievementSectionLabel = useCallback(
    (key: string) => {
      const normalizedKey = normalizeAchievementSectionKey(key);
      if (achievementSectionsMeta[normalizedKey]) {
        return achievementSectionsMeta[normalizedKey].title;
      }
      if (defaultAchievementSections[normalizedKey]) {
        return defaultAchievementSections[normalizedKey].title;
      }
      return `${capitalize(normalizedKey)} Achievements`;
    },
    [achievementSectionsMeta]
  );

  const achievementSectionOptions = [
    ...ACHIEVEMENT_SECTION_ORDER.map(({ key, title }) => ({
      key,
      title: achievementSectionsMeta[key]?.title || title,
    })),
    ...Object.entries(achievementSectionsMeta)
      .filter(
        ([key]) => !ACHIEVEMENT_SECTION_ORDER.some((section) => section.key === key)
      )
      .map(([key, value]) => ({
        key,
        title: value.title || `${capitalize(key)} Achievements`,
      })),
  ];

  const handleHomeSectionToggle = (sectionId: string) => (_: unknown, isExpanded: boolean) => {
    setExpandedHomeSection(isExpanded ? sectionId : '');
  };

  const handlePrincipalPhotoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Please choose a valid image file (PNG or JPG).');
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      showError('Image is too large. Please upload a file smaller than 5 MB.');
      input.value = '';
      return;
    }

  if (!homeData) {
    showError('Home data is unavailable. Please refresh and try again.');
    input.value = '';
    return;
  }

    const previousPhoto = homeData.principalPhoto || '';

    try {
      setPrincipalPhotoFileName(file.name);
      setPrincipalPhotoUploading(true);

      const targetSchoolId = schoolId || 'educonnect';
      const folder = `schools/${targetSchoolId}`;
      const { secureUrl } = await uploadImageToCloudinary(file, { folder });

      const updatedHome = { ...homeData, principalPhoto: secureUrl };
      setHomeData(updatedHome);

      await updateHomePageContent(
        targetSchoolId,
        buildHomePagePayload(updatedHome, journeyMilestones)
      );

      await refreshSchoolData();
      showSuccess('Principal photo updated successfully!');
      setDirtyPage((prev) => (prev === 'both' ? 'contact' : null));
    } catch (error) {
      console.error('Failed to upload principal photo:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to upload principal photo.';
      showError(message);
      setHomeData((prev: any) =>
        prev ? { ...prev, principalPhoto: previousPhoto } : prev
      );
    } finally {
      setPrincipalPhotoUploading(false);
      setPrincipalPhotoFileName('');
      input.value = '';
    }
  };

  const handleHomeHeroImagesSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = Array.from(input.files || []);

    if (!homeData || files.length === 0) {
      input.value = '';
      return;
    }

    const invalidFile = files.find(
      (file) => !file.type.startsWith('image/') || file.size > MAX_IMAGE_UPLOAD_BYTES
    );
    if (invalidFile) {
      const reason = !invalidFile.type.startsWith('image/')
        ? 'Please choose valid image files (PNG or JPG).'
        : 'One or more images are larger than 5 MB.';
      showError(reason);
      input.value = '';
      return;
    }

    const targetSchoolId = schoolId || 'educonnect';
    const previousImages = Array.isArray(homeData.heroImages) ? homeData.heroImages : [];

    try {
      setHomeHeroImagesSaving(true);
      setHomeHeroUploadStatus(
        files.length > 1 ? `Uploading ${files.length} images...` : `Uploading ${files[0].name}...`
      );

      const folder = `schools/${targetSchoolId}/home`;
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const { secureUrl } = await uploadImageToCloudinary(file, { folder });
        uploadedUrls.push(secureUrl);
      }

      const updatedImages = [...previousImages, ...uploadedUrls];
      const updatedHome = { ...homeData, heroImages: updatedImages };
      setHomeData(updatedHome);

      await updateHomePageContent(
        targetSchoolId,
        buildHomePagePayload(updatedHome, journeyMilestones)
      );
      await refreshSchoolData();
      showSuccess(files.length > 1 ? 'Home images uploaded!' : 'Home image uploaded!');
    } catch (error) {
      console.error('Failed to upload home hero images:', error);
      showError('Failed to upload home images. Please try again.');
    } finally {
      setHomeHeroImagesSaving(false);
      setHomeHeroUploadStatus('');
      input.value = '';
    }
  };

  const handleRemoveHomeHeroImage = async (imageUrl: string) => {
    if (!homeData) return;

    const targetSchoolId = schoolId || 'educonnect';
    const previousImages = Array.isArray(homeData.heroImages) ? homeData.heroImages : [];
    const updatedImages = previousImages.filter((url: string) => url !== imageUrl);
    const updatedHome = { ...homeData, heroImages: updatedImages };
    setHomeData(updatedHome);

    try {
      setHomeHeroImagesSaving(true);
      setHomeHeroUploadStatus('Removing image...');
      await updateHomePageContent(
        targetSchoolId,
        buildHomePagePayload(updatedHome, journeyMilestones)
      );
      await refreshSchoolData();
      showSuccess('Home image removed.');
    } catch (error) {
      console.error('Failed to remove home image:', error);
      setHomeData((prev: any) =>
        prev ? { ...prev, heroImages: previousImages } : prev
      );
      showError('Failed to remove home image. Please try again.');
    } finally {
      setHomeHeroImagesSaving(false);
      setHomeHeroUploadStatus('');
    }
  };

  const handleStaffPhotoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file || !editingStaff) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Please choose a valid image file (PNG or JPG).');
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      showError('Image is too large. Please upload a file smaller than 5 MB.');
      input.value = '';
      return;
    }

  if (staffPhotoPreviewUrl) {
    URL.revokeObjectURL(staffPhotoPreviewUrl);
  }

  setStaffPhotoFileName(file.name);
  setPendingStaffPhotoFile(file);
    setStaffPhotoPreviewUrl(URL.createObjectURL(file));
  input.value = '';
};

const handleAchievementPhotoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file || !editingAchievement) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Please choose a valid image file (PNG or JPG).');
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      showError('Image is too large. Please upload a file smaller than 5 MB.');
      input.value = '';
      return;
    }

  if (achievementPhotoPreviewUrl) {
    URL.revokeObjectURL(achievementPhotoPreviewUrl);
  }

  setAchievementPhotoFileName(file.name);
  setPendingAchievementPhotoFile(file);
    setAchievementPhotoPreviewUrl(URL.createObjectURL(file));
  input.value = '';
};

  const handleAlumniPhotoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file || !editingAlumni) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Please choose a valid image file (PNG or JPG).');
      input.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      showError('Image is too large. Please upload a file smaller than 5 MB.');
      input.value = '';
      return;
    }

    if (alumniPhotoPreviewUrl) {
      URL.revokeObjectURL(alumniPhotoPreviewUrl);
    }

    setAlumniPhotoFileName(file.name);
    setPendingAlumniPhotoFile(file);
    setAlumniPhotoPreviewUrl(URL.createObjectURL(file));
    input.value = '';
  };

  const handleStaffPhotoRemove = () => {
    if (!editingStaff) return;

    if (pendingStaffPhotoFile || staffPhotoPreviewUrl) {
      if (staffPhotoPreviewUrl) {
        URL.revokeObjectURL(staffPhotoPreviewUrl);
      }
      setStaffPhotoPreviewUrl('');
      setPendingStaffPhotoFile(null);
      setStaffPhotoFileName('');
      return;
    }

    if (editingStaff.image) {
      if (staffPhotoPreviewUrl) {
        URL.revokeObjectURL(staffPhotoPreviewUrl);
      }
      setStaffPhotoPreviewUrl('');
      setPendingStaffPhotoFile(null);
      setEditingStaff({ ...editingStaff, image: '' });
      setStaffPhotoFileName('');
      showSuccess('Staff photo removed. Save to apply the change.');
    }
  };

  const handleAchievementPhotoRemove = () => {
    if (!editingAchievement) return;

    if (pendingAchievementPhotoFile || achievementPhotoPreviewUrl) {
      if (achievementPhotoPreviewUrl) {
        URL.revokeObjectURL(achievementPhotoPreviewUrl);
      }
      setAchievementPhotoPreviewUrl('');
      setPendingAchievementPhotoFile(null);
      setAchievementPhotoFileName('');
      return;
    }

    if (editingAchievement.image) {
      if (achievementPhotoPreviewUrl) {
        URL.revokeObjectURL(achievementPhotoPreviewUrl);
      }
      setAchievementPhotoPreviewUrl('');
      setPendingAchievementPhotoFile(null);
      setEditingAchievement({ ...editingAchievement, image: '' });
      setAchievementPhotoFileName('');
      showSuccess('Achievement photo removed. Save to apply the change.');
    }
  };

  const handleAlumniPhotoRemove = () => {
    if (!editingAlumni) return;

    if (pendingAlumniPhotoFile || alumniPhotoPreviewUrl) {
      if (alumniPhotoPreviewUrl) {
        URL.revokeObjectURL(alumniPhotoPreviewUrl);
      }
      setAlumniPhotoPreviewUrl('');
      setPendingAlumniPhotoFile(null);
      setAlumniPhotoFileName('');
      return;
    }

    if (editingAlumni.image) {
      if (alumniPhotoPreviewUrl) {
        URL.revokeObjectURL(alumniPhotoPreviewUrl);
      }
      setAlumniPhotoPreviewUrl('');
      setPendingAlumniPhotoFile(null);
      setEditingAlumni({ ...editingAlumni, image: '' });
      setAlumniPhotoFileName('');
      showSuccess('Alumni photo removed. Save to apply the change.');
    }
  };

  const handleGalleryPhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = input.files;
    if (!editingGallery || !files || files.length === 0) {
      input.value = '';
      return;
    }

    const acceptedFiles: File[] = [];
    const newPreviews: string[] = [];
    const newNames: string[] = [];
    let skipped = false;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        skipped = true;
        return;
      }
      if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
        skipped = true;
        return;
      }
      acceptedFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
      newNames.push(file.name);
    });

    if (skipped) {
      showError('Some files were skipped because they were not valid images under 5 MB.');
    }

    if (!acceptedFiles.length) {
      input.value = '';
      return;
    }

    setPendingGalleryPhotoFiles((prev) => [...prev, ...acceptedFiles]);
    setGalleryPhotoPreviewUrls((prev) => [...prev, ...newPreviews]);
    setGalleryPhotoFileNames((prev) => [...prev, ...newNames]);
    input.value = '';
  };

  const removePendingGalleryPhoto = (index: number) => {
    setPendingGalleryPhotoFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
    setGalleryPhotoFileNames((prev) => prev.filter((_, nameIndex) => nameIndex !== index));
    setGalleryPhotoPreviewUrls((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1);
      if (removed[0]) {
        URL.revokeObjectURL(removed[0]);
      }
      return next;
    });
  };

  const removeExistingGalleryPhoto = (index: number) => {
    setEditingGallery((prev) => {
      if (!prev) return prev;
      const nextImages = (prev.images || []).filter((_, imageIndex) => imageIndex !== index);
      return { ...prev, images: nextImages };
    });
  };

  const renderHomeAccordionSummary = (
    icon: ReactElement,
    title: string,
    subtitle: string,
    metaLabel?: string
  ) => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: '100%', gap: { xs: 1.5, sm: 2 } }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 28px rgba(25,118,210,0.35)',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {metaLabel ? (
        <Chip
          label={metaLabel}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderColor: 'rgba(25,118,210,0.35)',
            color: 'primary.main',
            bgcolor: 'rgba(25,118,210,0.1)',
          }}
        />
      ) : null}
    </Stack>
  );

  const formatCountLabel = (count: number, singular: string) =>
    count === 1 ? `1 ${singular}` : `${count} ${singular}s`;

  const contactFieldMap: Record<string, string> = {
    address: 'address',
    phone: 'phone',
    email: 'email',
    hours: 'officeHours',
    whatsapp: 'whatsApp',
    facebook: 'facebook',
    instagram: 'instagram',
  };

  const homeFieldMap: Record<string, string> = {
    title: 'welcomeTitle',
    subtitle: 'welcomeSubTitle',
    principalName: 'principalName',
    principalMessage: 'principalMessage',
    principalPhoto: 'principalPhoto',
    yearEstablished: 'yearEstablished',
    students: 'students',
    teachers: 'teachers',
    successRate: 'successRate',
  };

  const inlinePlaceholders: Record<'contact' | 'home', Record<string, string>> = {
    contact: {
      address: 'No address provided',
      phone: 'No phone numbers listed',
      email: 'No email address listed',
      hours: 'No office hours provided',
      whatsapp: 'No WhatsApp number',
      facebook: 'No Facebook page linked',
      instagram: 'No Instagram profile linked',
    },
    home: {
      title: 'Add a welcome title',
      subtitle: 'Add a welcome subtitle',
      principalName: "Add the principal's name",
      principalMessage: "Add a principal message",
      principalPhoto: 'No principal photo uploaded yet',
      homeHeroImages: 'No hero images uploaded yet',
      yearEstablished: 'Add the founding year',
      students: 'Add total enrolled students',
      teachers: 'Add total teaching staff',
      successRate: 'Add success rate percentage',
    },
  };

  const inlineHelperText: Record<'contact' | 'home', Record<string, string>> = {
    contact: {
      address: "Enter the school's mailing address. (Required)",
      phone: 'Include country or area code. Separate numbers with commas.',
      email: 'Provide a valid contact email address.',
      hours: 'Enter one schedule per line.',
      whatsapp: 'Include country or area code. Separate numbers with commas.',
      facebook: 'Paste the full Facebook page URL.',
      instagram: 'Paste the full Instagram profile URL.',
    },
    home: {
      title: 'Shown as the main heading on the home page. (Required)',
      subtitle: 'Displayed beneath the welcome title. (Required)',
      principalName: 'Shown in the principal highlight section. (Required)',
      principalMessage: 'Share a short greeting from the principal (max 500 characters).',
      principalPhoto: 'Upload a friendly portrait of the principal (PNG or JPG).',
      yearEstablished: 'Use a four-digit year (e.g., 1998).',
      students: 'Example: 1500 or 2500+.',
      teachers: 'Example: 85 or 120+.',
      successRate: 'Enter a percentage between 0 and 100.',
    },
  };

  const inlineRequiredMessages: Record<'contact' | 'home', Partial<Record<string, string>>> = {
    contact: {
      address: 'School address is required.',
    },
    home: {
      title: 'Welcome title is required.',
      subtitle: 'Welcome subtitle is required.',
      principalName: 'Principal name is required.',
    },
  };

  const isInlineFieldRequired = (section: 'home' | 'contact', key: string) =>
    Boolean(inlineRequiredMessages[section]?.[key]);

  type LevelStyle = { label: string; color: string; icon: typeof Public };
  const levelStyles: Record<string, LevelStyle> = {
    international: { label: 'International', color: '#d32f2f', icon: Public },
    national: { label: 'National', color: '#f57c00', icon: Star },
    state: { label: 'State', color: '#388e3c', icon: TrendingUp },
    district: { label: 'District', color: '#1976d2', icon: WorkspacePremium },
    school: { label: 'School', color: '#7b1fa2', icon: School },
    others: { label: 'Others', color: '#546e7a', icon: WorkspacePremium },
  };

  const achievementLevelOptions = [
    { value: 'international', label: 'International' },
    { value: 'national', label: 'National' },
    { value: 'state', label: 'State' },
    { value: 'district', label: 'District' },
    { value: 'school', label: 'School' },
    { value: 'others', label: 'Others' },
  ];

  const renderLevelChip = (level: string) => {
    const key = (level || '').toLowerCase();
    const style = levelStyles[key];
    if (!style) {
      return (
        <Chip
          label={level || 'Level'}
          size="small"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'divider',
          }}
        />
      );
    }
    const IconComponent = style.icon;
    return (
      <Chip
        label={style.label}
        size="small"
        icon={
          <IconComponent
            sx={{
              color: 'text.primary !important',
              fontSize: 18,
            }}
          />
        }
        sx={{
          fontWeight: 600,
          backgroundColor: 'transparent',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiChip-icon': {
            color: 'text.primary !important',
          },
        }}
      />
    );
  };

  const multilineFieldMap: Record<'contact' | 'home', Set<string>> = {
    contact: new Set(['address', 'hours']),
    home: new Set(['principalMessage']),
  };

  const getFieldValue = (section: 'home' | 'contact', key: string): string => {
    if (section === 'contact') {
      const field = contactFieldMap[key];
      if (!field || !contactData) return '';
      return (contactData as Record<string, string>)[field] || '';
    }
    const field = homeFieldMap[key];
    if (!field || !homeData) return '';
    return (homeData as Record<string, string>)[field] || '';
  };

  const getContactDisplayLines = (key: string): string[] => {
    const value = getFieldValue('contact', key);
    if (!value) return [];
    if (key === 'address' || key === 'hours') {
      return value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    }
    if (key === 'phone' || key === 'email' || key === 'whatsapp') {
      return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
    return [value];
  };

  const getHomeDisplayLines = (key: string): string[] => {
    const value = getFieldValue('home', key);
    if (!value) return [];
    if (key === 'principalMessage') {
      const truncated = value.length > 240 ? `${value.slice(0, 240)}...` : value;
      return truncated
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    }
    if (key === 'successRate' && value && !value.includes('%')) {
      return [`${value}%`];
    }
    return [value];
  };

  const isMultilineField = (section: 'home' | 'contact', key: string) =>
    multilineFieldMap[section].has(key);

  const openInlineEditor = (section: 'home' | 'contact', key: string) => {
    setInlineError(null);
    setEditingField({ section, key });
    setEditingValue(getFieldValue(section, key));
  };

  const cancelInlineEdit = () => {
    setInlineError(null);
    setEditingField(null);
    setEditingValue('');
  };

  const validateInlineValue = (
    section: 'home' | 'contact',
    key: string,
    value: string
  ): string | null => {
    const trimmedValue = value.trim();
    const requiredMessage = inlineRequiredMessages[section]?.[key];
    if (requiredMessage && !trimmedValue) {
      return requiredMessage;
    }

    if (section === 'contact') {
      if (!trimmedValue) return null;
      if (key === 'phone' || key === 'whatsapp') {
        const phoneRegex = /^[\d+\-()\s]+$/;
        const invalid = value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
          .some((entry) => !phoneRegex.test(entry));
        return invalid ? 'Only digits, punctuation, + allowed.' : null;
      }
      if (key === 'email') {
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        const invalid = value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
          .some((entry) => !emailRegex.test(entry));
        return invalid ? 'Enter a valid email address.' : null;
      }
      if (key === 'facebook' || key === 'instagram') {
        if (!trimmedValue) return null;
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
        return urlRegex.test(trimmedValue)
          ? null
          : 'Enter a valid URL (include https:// if possible).';
      }
      return null;
    }

    // Home section validation
    switch (key) {
      case 'title':
      case 'subtitle':
      case 'principalName':
        return null;
      case 'principalMessage':
        return value.length > 500 ? 'Maximum 500 characters allowed.' : null;
      case 'yearEstablished':
        if (!trimmedValue) return null;
        if (!/^\d{4}$/.test(trimmedValue)) return 'Use a four-digit year (>= 1800).';
        const year = Number(trimmedValue);
        const currentYear = new Date().getFullYear();
        if (year < 1800 || year > currentYear) return 'Enter a valid year.';
        return null;
      case 'students':
        if (!trimmedValue) return null;
        return /^[\d+\s,]+$/.test(trimmedValue) ? null : 'Use digits or "+" only.';
      case 'teachers':
        if (!trimmedValue) return null;
        return /^[\d+\s,]+$/.test(trimmedValue) ? null : 'Use digits or "+" only.';
      case 'successRate': {
        if (!trimmedValue) return null;
        const cleaned = trimmedValue.replace('%', '').trim();
        const numeric = Number(cleaned);
        if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
          return 'Enter a value between 0 and 100.';
        }
        return null;
      }
      default:
        return null;
    }
  };

  const normalizeInlineValue = (
    section: 'home' | 'contact',
    key: string,
    value: string
  ): string => {
    if (section === 'home') {
      if (key === 'successRate') {
        if (!value) return '';
        const cleaned = value.replace('%', '').trim();
        return cleaned ? `${cleaned}${value.includes('%') ? '' : '%'}` : '';
      }
      if (key === 'principalMessage') {
        return value.length > 500 ? value.slice(0, 500) : value;
      }
    }
    return value;
  };

  const buildHomePagePayload = (
    home: typeof homeData,
    milestones: JourneyMilestone[]
  ) => ({
    welcomeTitle: home?.heroSection?.welcomeTitle || home?.welcomeTitle || '',
    welcomeSubTitle: home?.heroSection?.welcomeSubtitle || home?.welcomeSubTitle || '',
    principalName: home?.principalName || '',
    principalMessage: home?.principalMessage || '',
    principalPhotoUrl: home?.principalPhoto || '',
    heroImages: normalizeHomeHeroImages(home?.heroImages),
    yearEstablished: home?.yearEstablished || '',
    students: home?.students || '',
    teachers: home?.teachers || '',
    successRate: home?.successRate || '',
    journeyMilestones: sortJourneyMilestones(milestones).map((milestone) => ({
      id: milestone.id,
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
    })),
  });

  const normalizeStaffSpecializations = (value: any): string => {
    if (!value) return '';
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0)
        .join(', ');
    }
    if (typeof value === 'object') {
      return Object.values(value)
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0)
        .join(', ');
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  };

  const extractStaffEntries = (raw: any): any[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    const values = Object.values(raw);
    return values.filter(
      (value) =>
        value &&
        typeof value === 'object' &&
        ('name' in value || 'department' in value || 'position' in value)
    );
  };

  const extractAlumniEntries = (raw: any): any[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw.alumni)) return raw.alumni;
    if (Array.isArray(raw.alumniMembers)) return raw.alumniMembers;

    return Object.entries(raw)
      .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
      .map(([, value]) => value)
      .filter(
        (value) =>
          value &&
          typeof value === 'object' &&
          ('name' in value || 'currentPosition' in value || 'company' in value)
      );
  };

  const saveInlineEdit = async () => {
    if (!editingField) return;
    const { section, key } = editingField;
    const targetSchoolId = schoolId || 'educonnect';
    const baseValue = isMultilineField(section, key)
      ? editingValue.replace(/\s+$/, '')
      : editingValue.trim();

    const validationMessage = validateInlineValue(section, key, baseValue);
    if (validationMessage) {
      setInlineError(validationMessage);
      return;
    }

    const normalizedValue = normalizeInlineValue(section, key, baseValue);

    try {
      setIsSaving(true);
      if (section === 'contact') {
        const fieldName = contactFieldMap[key];
        if (!fieldName) return;
        const updated = { ...(contactData || {}), [fieldName]: normalizedValue };
        setContactData(updated);
        await updateContactPageContent(targetSchoolId, updated);
        await refreshSchoolData();
        showSuccess('Contact information updated successfully!');
        setDirtyPage((prev) => (prev === 'both' ? 'home' : null));
      } else {
        if (!homeData) {
          showError('Home data is unavailable.');
          return;
        }
        const fieldName = homeFieldMap[key];
        if (!fieldName) return;
        const updated = { ...homeData, [fieldName]: normalizedValue };
        setHomeData(updated);
        await updateHomePageContent(
          targetSchoolId,
          buildHomePagePayload(updated, journeyMilestones)
        );
        await refreshSchoolData();
        showSuccess('Home information updated successfully!');
        setDirtyPage((prev) => (prev === 'both' ? 'contact' : null));
      }
      setInlineError(null);
      setEditingField(null);
      setEditingValue('');
    } catch (error) {
      console.error('Failed to save inline changes:', error);
      showError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  type SummaryGridOptions = {
    columns?: Partial<Record<'sm' | 'md' | 'lg', number>>;
  };

  const renderSummaryGrid = (
    section: 'home' | 'contact',
    items: Array<{ key: string; title: string; icon: ReactElement; lines: string[] }>,
    options: SummaryGridOptions = {}
  ) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: (() => {
          const template: Record<string, string> = {
            xs: '1fr',
            sm: `repeat(${options.columns?.sm ?? 2}, minmax(0, 1fr))`,
          };
          if (options.columns?.md) {
            template.md = `repeat(${options.columns.md}, minmax(0, 1fr))`;
          }
          template.lg = `repeat(${options.columns?.lg ?? 3}, minmax(0, 1fr))`;
          return template;
        })(),
        gap: { xs: 2, sm: 2.5 },
      }}
    >
      {items.map(({ key, title, icon, lines }) => {
        const isEditing = editingField?.section === section && editingField.key === key;
        const isMultiline = isMultilineField(section, key);
        const displayLines =
          lines.length > 0 ? lines : [inlinePlaceholders[section][key] || 'Not provided'];
        const helperBase = inlineHelperText[section][key] || '';
        const helperText =
          isEditing && inlineError
            ? inlineError
            : section === 'home' && key === 'principalMessage' && isEditing
            ? `${editingValue.length}/500 characters`
            : helperBase;

        if (section === 'home' && key === 'principalPhoto') {
          const fileLabel = principalPhotoFileName;
          const currentPhotoUrl = homeData?.principalPhoto;

          return (
            <Paper
              key={`${section}-${key}`}
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {icon}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2} sx={{ py: 1 }}>
                {currentPhotoUrl ? (
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    <Box
                      component="img"
                      src={currentPhotoUrl}
                      alt="Principal portrait"
                      sx={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
                      }}
                    />
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Current photo
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        component="a"
                        href={currentPhotoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ px: 0, alignSelf: 'flex-start' }}
                      >
                        Open full size
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No photo saved yet. Upload one to highlight the principal on the home page.
                  </Typography>
                )}

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems="center"
                  alignSelf="flex-start"
                >
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ fontWeight: 600 }}
                    disabled={principalPhotoUploading}
                  >
                    {principalPhotoUploading ? 'Uploading...' : 'Choose Image'}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handlePrincipalPhotoSelect}
                      disabled={principalPhotoUploading}
                    />
                  </Button>
                  {principalPhotoUploading && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} />
                      <Typography variant="body2" color="text.secondary">
                        Uploading {fileLabel || 'image'}...
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  Upload a clear PNG or JPG portrait up to 5 MB.
                </Typography>
              </Stack>
            </Paper>
          );
        }

        if (section === 'home' && key === 'homeHeroImages') {
          const heroImages = Array.isArray(homeData?.heroImages) ? homeData.heroImages : [];

          return (
            <Paper
              key={`${section}-${key}`}
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {icon}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                </Box>
                {heroImages.length > 0 && (
                  <Chip
                    size="small"
                    color="primary"
                    variant="outlined"
                    label={formatCountLabel(heroImages.length, 'image')}
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              <Stack spacing={2}>
                {heroImages.length > 0 ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(3, minmax(0, 1fr))',
                        sm: 'repeat(4, minmax(0, 1fr))',
                      },
                      gap: 1,
                    }}
                  >
                    {heroImages.map((url: string, index: number) => (
                      <Box
                        key={`${url}-${index}`}
                        sx={{
                          position: 'relative',
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.18)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
                        }}
                      >
                        <Box
                          component="img"
                          src={url}
                          alt={`Home hero ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: { xs: 70, sm: 80 },
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 1,
                            py: 0.5,
                            bgcolor: 'rgba(0,0,0,0.55)',
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Image {index + 1}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Button
                              size="small"
                              variant="text"
                              component="a"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ color: '#fff', textTransform: 'none', px: 0.5 }}
                            >
                              View
                            </Button>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveHomeHeroImage(url)}
                              disabled={homeHeroImagesSaving || isSaving}
                              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                            >
                              <Trash2 fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Add hero images to create a rotating banner on the public home page.
                  </Typography>
                )}

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ fontWeight: 600 }}
                    disabled={homeHeroImagesSaving}
                  >
                    {homeHeroImagesSaving && homeHeroUploadStatus
                      ? 'Saving...'
                      : 'Add Home Images'}
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleHomeHeroImagesSelect}
                      disabled={homeHeroImagesSaving}
                    />
                  </Button>

                  {homeHeroImagesSaving && homeHeroUploadStatus && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} />
                      <Typography variant="body2" color="text.secondary">
                        {homeHeroUploadStatus}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  Upload multiple PNG or JPG files up to 5 MB each. These images appear as a
                  scrolling hero gallery on the public home page.
                </Typography>
              </Stack>
            </Paper>
          );
        }

        return (
          <Paper
            key={`${section}-${key}`}
            variant="outlined"
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
              </Box>
              <Tooltip title={isEditing ? 'Editing in progress' : `Edit ${title}`}>
                <span>
                  <IconButton
                    size="small"
                    onClick={() => openInlineEditor(section, key)}
                    disabled={isSaving}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            {isEditing ? (
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  multiline={isMultiline}
                  minRows={isMultiline ? 3 : undefined}
                  value={editingValue}
                  error={Boolean(inlineError)}
                  required={isInlineFieldRequired(section, key)}
                  onChange={(e) => {
                    const nextValue =
                      section === 'home' && key === 'principalMessage'
                        ? e.target.value.slice(0, 500)
                        : e.target.value;
                    setEditingValue(nextValue);
                    if (inlineError) setInlineError(null);
                  }}
                  placeholder={inlinePlaceholders[section][key] || ''}
                  helperText={helperText}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={cancelInlineEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={saveInlineEdit}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  opacity: lines.length > 0 ? 0.9 : 0.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {displayLines.join('\n')}
              </Typography>
            )}
          </Paper>
        );
      })}
    </Box>
  );

  const applySchoolData = useCallback((schoolData: any | null) => {
    if (!schoolData) {
      setSchoolInfo(null);
      setHomeData(null);
      setJourneyMilestones([]);
      setAchievements([]);
      setAchievementSectionsMeta({ ...defaultAchievementSections });
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
    const heroImages = normalizeHomeHeroImages(
      homePage.heroSection?.heroImages || homePage.heroImages || principalSection.heroImages
    );

    setHomeData({
      welcomeTitle: homePage.welcomeTitle || schoolData.welcomeTitle || '',
      welcomeSubTitle: homePage.welcomeSubtitle || schoolData.welcomeSubtitle || '',
      principalName: principalSection.name || homePage.principalName || '',
      principalMessage: principalSection.message || homePage.principalMessage || '',
      principalPhoto: principalSection.image || homePage.principalPhoto || '',
      yearEstablished: statisticsSection.yearEstablished || schoolData.yearEstablished || '',
      students: statisticsSection.studentsCount || schoolData.studentsCount || '',
      teachers: statisticsSection.teachersCount || schoolData.teachersCount || '',
      successRate: statisticsSection.successRate || schoolData.successRate || '',
      heroImages,
    });

    setPrincipalPhotoFileName('');

    const timelineSourceCandidates = [
      homePage.timelineSection?.milestones,
      homePage.timelineSection,
      homePage.timeline,
      schoolData.timelineSection?.milestones,
      schoolData.timeline?.milestones,
      schoolData.timeline,
    ];

    const timelineEntries = (timelineSourceCandidates.find((candidate) => Array.isArray(candidate)) ||
      []) as Array<Record<string, any>>;

    const normalizedJourney = timelineEntries.map((milestone, index) => ({
      id: milestone.id || `journey-${index + 1}`,
      year: milestone.year || '',
      title: milestone.title || '',
      description: milestone.description || '',
    }));

    setJourneyMilestones(sortJourneyMilestones(normalizedJourney));

    const achievementsPage = pages.achievementsPage || {};
    const achievementItems: Array<{ item: any; fallbackKey?: string; fallbackTitle?: string }> = [];

    const pushAchievementItem = (item: any, fallbackKey?: string, fallbackTitle?: string) => {
      if (!item || typeof item !== 'object') return;
      achievementItems.push({ item, fallbackKey, fallbackTitle });
    };

    if (Array.isArray(achievementsPage)) {
      achievementsPage.forEach((item: any) => pushAchievementItem(item));
    } else {
      Object.entries(achievementsPage)
        .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
        .forEach(([key, value]) => {
          if (!value) return;
          if (Array.isArray(value)) {
            value.forEach((item: any) => pushAchievementItem(item, key));
            return;
          }
          const sectionObject = value as any;
          if (Array.isArray(sectionObject?.achievements)) {
            const fallbackKey = normalizeAchievementSectionKey(sectionObject.sectionKey || key);
            const fallbackTitle = sectionObject.title || sectionObject.sectionTitle;
            sectionObject.achievements.forEach((item: any) =>
              pushAchievementItem(item, fallbackKey, fallbackTitle)
            );
            return;
          }
          pushAchievementItem(sectionObject, key, sectionObject.title || sectionObject.sectionTitle);
        });
    }

    const computedAchievements = achievementItems.map(({ item, fallbackKey, fallbackTitle }, index) => {
      const rawLevel = (item.level || item.Level || '').toString().trim();
      const normalizedLevel = rawLevel ? rawLevel.toLowerCase() : 'others';
      const resolvedSectionKey = item.sectionKey || item.section || fallbackKey || 'general';
      const normalizedSectionKey = normalizeAchievementSectionKey(resolvedSectionKey);
      const sectionTitle =
        item.sectionTitle ||
        fallbackTitle ||
        defaultAchievementSections[normalizedSectionKey]?.title ||
        `${capitalize(normalizedSectionKey)} Achievements`;

      return {
        id: item.id || `achievement-${index + 1}`,
        title: item.title || '',
        description: item.description || '',
        date: item.date || item.year || '',
        level: normalizedLevel,
        sectionKey: normalizedSectionKey,
        sectionTitle,
        image: item.image || '',
      };
    });

    const sectionsMeta = computedAchievements.reduce<Record<string, { title: string }>>((acc, item) => {
      const key = item.sectionKey || 'general';
      if (!acc[key]) {
        acc[key] = { title: item.sectionTitle || `${capitalize(key)} Achievements` };
      }
      return acc;
    }, { ...defaultAchievementSections });

    setAchievementSectionsMeta(sectionsMeta);
    setAchievements(computedAchievements);

    const staffEntries = extractStaffEntries(pages.staffPage);
    setStaffMembers(
      staffEntries.map((staff: any, index: number) => ({
        id: staff.id || `staff-${index + 1}`,
        name: staff.name || '',
        department: staff.department || 'other',
        position: staff.position || '',
        education: staff.education || '',
        specializations: normalizeStaffSpecializations(
          staff.specializations || staff.specialties || staff.skills || ''
        ),
        experience: staff.experience || '',
        email: staff.email || '',
        phone: staff.phone || '',
        image: staff.image || staff.imageUrl || '',
        schoolId: staff.schoolId || schoolData.id,
      }))
    );

    const alumniSource = extractAlumniEntries(pages.alumniPage);
    setAlumniMembers(
      alumniSource.map((alumni: any, index: number) => ({
        id: alumni.id || `alumni-${index + 1}`,
        name: String(alumni.name || `Alumni ${index + 1}`).trim(),
        company: String(alumni.company || '').trim(),
        currentPosition: String(alumni.currentPosition || '').trim(),
        graduationYear: String(alumni.graduationYear || '').trim(),
        image: String(alumni.image || alumni.imageUrl || '').trim(),
        industry: String(alumni.industry || '').trim() || 'Other',
        location: String(alumni.location || '').trim(),
        linkedinUrl: String(alumni.linkedinUrl || alumni.linkedIn || '').trim(),
      }))
    );

    const galleryPage = pages.galleryPage || {};
    const galleryItems: GalleryImage[] = [];

const looksLikeGalleryItem = (value: any): boolean => {
  if (!value) return false;
  if (typeof value === 'string') return true;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value.images)) return true;
  const possible = value.images || value.image || value.imageUrl || value.url || value.src;
  if (Array.isArray(possible)) return true;
  if (['videoUrl', 'video', 'videoUrls'].some((key) => Boolean(value[key]))) return true;
  return ['imageUrl', 'url', 'image', 'src'].some((key) => Boolean(value[key]));
};

  const toArray = (value: any): any[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') return Object.values(value);
    return [];
  };

  const extractImagesArray = (value: any): string[] => {
    const candidates = toArray(value);
    if (!candidates.length && typeof value === 'string') {
      return value.trim() ? [value.trim()] : [];
    }
    if (!candidates.length && typeof value === 'object') {
      const nested = value?.image || value?.imageUrl || value?.url || value?.src;
      if (typeof nested === 'string') {
        return nested.trim() ? [nested.trim()] : [];
      }
      return extractImagesArray(nested);
    }
    return candidates
      .map((item) =>
        typeof item === 'string'
          ? item
          : item?.image || item?.imageUrl || item?.url || item?.src || ''
      )
      .filter((url) => typeof url === 'string' && url.trim().length > 0);
  };

  const normalizeImage = (
    image: any,
    fallbackPrefix = 'gallery',
    fallbackCategory = defaultGalleryCategory
  ) => {
    if (!image) return;

    if (Array.isArray(image)) {
      image.forEach((item) => normalizeImage(item, fallbackPrefix, fallbackCategory));
      return;
    }

    if (typeof image === 'object' && Array.isArray(image.images)) {
      const resolvedCategory = resolveGalleryCategoryLabel(
        image.category || fallbackCategory,
        fallbackCategory
      );
      const normalizedImages = extractImagesArray(image.images);
      const videoUrl = extractVideoUrl(image.videoUrl || image.videoUrls || image.video);
      if (!normalizedImages.length && !videoUrl) return;

      galleryItems.push({
        id: image.id || image.key || image.slug || `${fallbackPrefix}-${galleryItems.length + 1}`,
        title: image.title || image.name || `${resolvedCategory} ${galleryItems.length + 1}`,
        category: resolvedCategory,
        description: image.description || '',
        date: image.date || '',
        images: normalizedImages,
        videoUrl,
        type: videoUrl ? 'video' : 'image',
      });
      return;
    }

    const imageSource =
      typeof image === 'string'
        ? image
        : image?.imageUrl || image?.url || image?.image || image?.src || '';
    const videoUrlCandidate =
      typeof image === 'object'
        ? extractVideoUrl(image.videoUrl || image.videoUrls || image.video)
        : '';
    if (!imageSource && !videoUrlCandidate) return;

    const rawCategory =
      typeof image === 'object'
        ? image?.category || image?.section || image?.group || fallbackCategory
        : fallbackCategory;
    const resolvedCategory = resolveGalleryCategoryLabel(rawCategory, fallbackCategory);
    const titlePrefix = resolvedCategory;

    galleryItems.push({
      id:
        (typeof image === 'object' && (image.id || image.key || image.slug)) ||
        `${fallbackPrefix}-${galleryItems.length + 1}`,
      title:
        (typeof image === 'object' && (image.title || image.name)) ||
        `${titlePrefix} ${galleryItems.length + 1}`,
      category: resolvedCategory,
      description: (typeof image === 'object' ? image.description : '') || '',
      date: (typeof image === 'object' ? image.date : '') || '',
      images: imageSource ? [imageSource] : [],
      videoUrl: videoUrlCandidate,
      type: videoUrlCandidate ? 'video' : 'image',
    });
  };

    if (Array.isArray(galleryPage)) {
      galleryPage.forEach((entry: any) => normalizeImage(entry));
    } else {
      toArray(galleryPage).forEach((entry: any) => {
        if (looksLikeGalleryItem(entry)) {
          normalizeImage(entry);
        }
      });
    }

    toArray(galleryPage?.galleryImages).forEach((entry: any) =>
      normalizeImage(entry, 'gallery', 'Gallery')
    );

    Object.entries(galleryPage).forEach(([sectionKey, sectionValue]) => {
      if (sectionKey === 'galleryImages' || sectionKey === 'lastUpdated') return;
      const section = sectionValue as any;

      const imagesValue = section?.images;
      const sectionImages = extractImagesArray(imagesValue);
      if (sectionImages.length) {
        const sectionTitle = section?.title || sectionKey;
        normalizeImage({ ...section, images: sectionImages }, sectionKey, sectionTitle);
        return;
      }

      if (looksLikeGalleryItem(section)) {
        normalizeImage(section, sectionKey, sectionKey);
        return;
      }

      toArray(section).forEach((entry: any) => normalizeImage(entry, sectionKey, sectionKey));
    });

    // Deduplicate by id to prevent duplicates when multiple paths contain same item
    const dedupedGallery = galleryItems.reduce<GalleryImage[]>((acc, item) => {
      if (!acc.some((existing) => existing.id === item.id)) {
        acc.push(item);
      }
      return acc;
    }, []);

    setGalleryImages(dedupedGallery);

    const extractAnnouncements = (source: any): any[] => {
      if (!source) return [];
      if (Array.isArray(source)) return source;
      if (Array.isArray(source.announcements)) return source.announcements;
      if (Array.isArray(source.recentUpdates)) return source.recentUpdates;
      if (typeof source === 'object') {
        const values = Object.values(source).filter((value: any) => {
          if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return false;
          }
          const keys = Object.keys(value);
          return keys.some((key) => ['title', 'content', 'description'].includes(key));
        });
        if (values.length) {
          return values;
        }
      }
      return [];
    };

    const announcementsFromPage = extractAnnouncements(pages.announcementsPage);
    const announcementsFromHome = extractAnnouncements(homePage.announcementsSection);
    const rawAnnouncements = announcementsFromPage.length ? announcementsFromPage : announcementsFromHome;

    const normalizedAnnouncements: Announcement[] = rawAnnouncements.map((announcement: any, index: number) => {
      const primaryCategory =
      normalizeAnnouncementCategoryList([announcement.category])[0] || '';
      return {
        id: announcement.id || `announcement-${index + 1}`,
        title: announcement.title || '',
        description: announcement.description || '',
        date: announcement.date || '',
        category: primaryCategory,
        priority: (announcement.priority || 'medium').toLowerCase(),
        type: (announcement.type || 'announcement').toLowerCase(),
        isPinned: announcement.isPinned === true,
        isUrgent: announcement.isUrgent === true,
        audience: announcement.audience || '',
        author: announcement.author || '',
        tags: announcement.tags || [],
      };
    });

    setAnnouncements(normalizedAnnouncements);

    const rawContactPage = (pages.contactPage?.content ?? pages.contactPage ?? {}) as Record<string, any>;
    const rawContactInfo = (schoolData.contactInfo ?? {}) as Record<string, any>;
    const contactSource = { ...rawContactInfo, ...rawContactPage };
    const normalizeArrayField = (value: any, joinWith: string) =>
      Array.isArray(value) ? value.join(joinWith) : value || '';
    const socialMediaFrom = (value: any) =>
      value && typeof value === 'object' ? (value as Record<string, any>) : {};
    const mergedSocialMedia = {
      ...socialMediaFrom(rawContactInfo.socialMedia),
      ...socialMediaFrom(rawContactPage.socialMedia),
    };
    const firstStringValue = (...values: any[]) => {
      for (const item of values) {
        if (typeof item === 'string' && item.trim()) {
          return item.trim();
        }
      }
      return '';
    };

    setContactData({
      address: contactSource.address || '',
      phone: normalizeArrayField(contactSource.phone, ', '),
      whatsApp: normalizeArrayField(
        contactSource.whatsApp ?? mergedSocialMedia.whatsApp,
        ', '
      ),
      email: normalizeArrayField(contactSource.email, ', '),
      officeHours: normalizeArrayField(contactSource.officeHours, '\n'),
      facebook: firstStringValue(contactSource.facebook, mergedSocialMedia.facebook),
      instagram: firstStringValue(contactSource.instagram, mergedSocialMedia.instagram),
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

  const buildAchievementsPayload = (achievementsList: Achievement[] = achievements) => {
    return achievementsList.map((item, index) => {
      const normalizedSectionKey = normalizeAchievementSectionKey(item.sectionKey || 'general');
      const normalizedLevel = (item.level || 'others').toLowerCase();
      return {
        id: item.id || `achievement-${index + 1}`,
        title: item.title,
        description: item.description,
        date: item.date,
        year: item.date,
        level: normalizedLevel,
        sectionKey: normalizedSectionKey,
        sectionTitle: getAchievementSectionLabel(normalizedSectionKey),
        image: item.image || '',
      };
    });
  };

  const refreshSchoolData = useCallback(async () => {
    const refreshedData = await fetchAllData();
    if (refreshedData) {
      applySchoolData(refreshedData);
    }
  }, [applySchoolData, fetchAllData]);


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

  // Journey handlers
  const openAddJourney = () => {
    setEditingJourney({
      id: '',
      year: '',
      title: '',
      description: '',
    });
    setJourneyDialog(true);
  };

  const openEditJourney = (milestone: JourneyMilestone) => {
    setEditingJourney({ ...milestone });
    setJourneyDialog(true);
  };

  const closeJourneyDialog = () => {
    setJourneyDialog(false);
    setEditingJourney(null);
  };

  const saveJourneyMilestone = async () => {
    if (!editingJourney) return;
    if (!homeData) {
      showError('Home data is unavailable.');
      return;
    }

    const trimmedYear = editingJourney.year.trim();
    const trimmedTitle = editingJourney.title.trim();
    const trimmedDescription = editingJourney.description.trim();

    if (!trimmedYear || !trimmedTitle || !trimmedDescription) {
      showError('Year, title, and description are required.');
      return;
    }

    const normalizedEntry: JourneyMilestone = {
      id: editingJourney.id || `journey-${Date.now()}`,
      year: trimmedYear,
      title: trimmedTitle,
      description: trimmedDescription,
    };

    const updatedList = editingJourney.id
      ? journeyMilestones.map((item) => (item.id === editingJourney.id ? normalizedEntry : item))
      : [...journeyMilestones, normalizedEntry];
    const sortedList = sortJourneyMilestones(updatedList);

    const targetSchoolId = schoolId || 'educonnect';

    try {
      setIsSaving(true);
      await updateHomePageContent(
        targetSchoolId,
        buildHomePagePayload(homeData, sortedList)
      );
      setJourneyMilestones(sortedList);
      closeJourneyDialog();
      await refreshSchoolData();
      showSuccess('Journey milestone saved successfully!');
      setDirtyPage((prev) => (prev === 'both' ? 'contact' : null));
    } catch (error) {
      console.error('Failed to save journey milestone:', error);
      showError('Failed to save journey milestone. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  const deleteJourneyMilestone = async (id: string) => {
    if (!homeData) {
      showError('Home data is unavailable.');
      return;
    }

    const updatedList = journeyMilestones.filter((milestone) => milestone.id !== id);
    const sortedList = sortJourneyMilestones(updatedList);
    const targetSchoolId = schoolId || 'educonnect';

    try {
      setIsSaving(true);
      await updateHomePageContent(
        targetSchoolId,
        buildHomePagePayload(homeData, sortedList)
      );
      setJourneyMilestones(sortedList);
      await refreshSchoolData();
      showSuccess('Journey milestone removed.');
      setDirtyPage((prev) => (prev === 'both' ? 'contact' : null));
    } catch (error) {
      console.error('Failed to delete journey milestone:', error);
      showError('Failed to delete journey milestone. Please try again.');
      await refreshSchoolData();
    } finally {
      setIsSaving(false);
    }
  };

  // Achievement handlers
  const openAddAchievement = () => {
    resetAchievementPhotoSelection();
    setAchievementErrors({});
    setEditingAchievement({
      id: '',
      title: '',
      description: '',
      date: '',
      level: 'national',
      sectionKey: 'general',
      sectionTitle: getAchievementSectionLabel('general'),
      image: '',
    });
    setAchievementDialog(true);
  };

  const openEditAchievement = (achievement: Achievement) => {
    resetAchievementPhotoSelection();
    setAchievementErrors({});
    setEditingAchievement({ ...achievement });
    setAchievementDialog(true);
  };

  const closeAchievementDialog = () => {
    setAchievementDialog(false);
    setEditingAchievement(null);
    setAchievementErrors({});
    resetAchievementPhotoSelection();
  };

  const handleAchievementInputChange =
    (field: keyof AchievementFormErrors) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setEditingAchievement((prev) => (prev ? { ...prev, [field]: value } : prev));

      setAchievementErrors((prev) => {
        if (!prev[field]) {
          return prev;
        }
        if (!value.trim()) {
          return prev;
        }
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleStaffInputChange =
    <K extends keyof StaffFormErrors & keyof StaffMember>(field: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setEditingStaff((prev) => (prev ? { ...prev, [field]: value } : prev));

      setStaffErrors((prev) => {
        if (!prev[field]) {
          return prev;
        }

        const trimmed = value.trim();
        let isValid = true;

        if (field === 'email') {
          isValid = !trimmed || EMAIL_REGEX.test(trimmed);
        } else if (field === 'phone') {
          isValid = !trimmed || PHONE_REGEX.test(trimmed);
        } else {
          isValid = trimmed.length > 0;
        }

        if (!isValid) {
          return prev;
        }

        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleAlumniInputChange =
    <K extends keyof AlumniFormErrors & keyof AlumniMember>(field: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setEditingAlumni((prev) => (prev ? { ...prev, [field]: value } : prev));

      setAlumniErrors((prev) => {
        if (!prev[field]) {
          return prev;
        }

        const trimmed = value.trim();
        let isValid = true;

        if (field === 'graduationYear') {
          isValid = Boolean(trimmed) && GRADUATION_YEAR_REGEX.test(trimmed);
        } else if (field === 'linkedinUrl') {
          isValid = !trimmed || LINKEDIN_URL_REGEX.test(trimmed);
        } else {
          isValid = trimmed.length > 0;
        }

        if (!isValid) {
          return prev;
        }

        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleGalleryInputChange =
    <K extends keyof GalleryFormErrors & keyof GalleryImage>(field: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setEditingGallery((prev) => (prev ? { ...prev, [field]: value } : prev));

      setGalleryErrors((prev) => {
        if (!prev[field]) {
          return prev;
        }

        const trimmed = value.trim();
        const isValid =
          field === 'videoUrl' ? !trimmed || isValidYouTubeUrl(trimmed) : trimmed.length > 0;

        if (!isValid) {
          return prev;
        }

        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleAnnouncementInputChange =
    <K extends keyof AnnouncementFormErrors & keyof Announcement>(field: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setEditingAnnouncement((prev) => (prev ? { ...prev, [field]: value } : prev));

      setAnnouncementErrors((prev) => {
        if (!prev[field]) {
          return prev;
        }

        const trimmed = value.trim();
        const isValid = trimmed.length > 0;

        if (!isValid) {
          return prev;
        }

        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const saveAchievement = async () => {
    if (!editingAchievement) return;

    const trimmedTitle = (editingAchievement.title || '').trim();
    const trimmedDescription = (editingAchievement.description || '').trim();
    const trimmedDate = (editingAchievement.date || '').trim();

    const errors: AchievementFormErrors = {};

    if (!trimmedTitle) {
      errors.title = 'Title is required.';
    }
    if (!trimmedDescription) {
      errors.description = 'Description is required.';
    }
    if (!trimmedDate) {
      errors.date = 'Date is required.';
    }

    if (Object.keys(errors).length > 0) {
      setAchievementErrors(errors);
      return;
    }

    setAchievementErrors({});

    setIsSaving(true);

    const targetSchoolId = schoolId || 'educonnect';
    let image = (editingAchievement.image || '').trim();

    try {
      if (pendingAchievementPhotoFile) {
        setAchievementPhotoUploading(true);
        const folder = `schools/${targetSchoolId}/achievements`;
        const { secureUrl } = await uploadImageToCloudinary(pendingAchievementPhotoFile, {
          folder,
        });
        image = secureUrl;
      } else if (!image) {
        image = '';
      }

      const normalizedSectionKey = normalizeAchievementSectionKey(editingAchievement.sectionKey || 'general');
      const normalizedLevel = (editingAchievement.level || 'others').toString().toLowerCase();
      const sectionTitle = getAchievementSectionLabel(normalizedSectionKey);

      const achievementEntry: Achievement = {
        ...editingAchievement,
        id: editingAchievement.id || `achievement-${Date.now()}`,
        title: trimmedTitle,
        description: trimmedDescription,
        date: trimmedDate,
        sectionKey: normalizedSectionKey,
        sectionTitle,
        level: normalizedLevel,
        image,
        schoolId: editingAchievement.schoolId || schoolInfo?.id || schoolId || '',
      };

      const updatedList = editingAchievement.id
        ? achievements.map((a: Achievement) => (a.id === editingAchievement.id ? achievementEntry : a))
        : [...achievements, achievementEntry];

      const payload = buildAchievementsPayload(updatedList);
      await updateAchievementsPageContent(targetSchoolId, payload);
      setAchievements(updatedList);
      closeAchievementDialog();
      await refreshSchoolData();
      showSuccess('Achievement saved successfully!');
    } catch (error) {
      console.error('Failed to save achievement:', error);
      showError('Failed to save achievement. Please try again.');
      await refreshSchoolData();
    } finally {
      setAchievementPhotoUploading(false);
      setIsSaving(false);
    }
  };

  const deleteAchievement = async (id: string) => {
    const updatedList = achievements.filter((a: Achievement) => a.id !== id);
    setAchievements(updatedList);

    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      const payload = buildAchievementsPayload(updatedList);
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

  const resetAchievementPhotoSelection = () => {
    if (achievementPhotoPreviewUrl) {
      URL.revokeObjectURL(achievementPhotoPreviewUrl);
    }
    setAchievementPhotoPreviewUrl('');
    setAchievementPhotoFileName('');
    setPendingAchievementPhotoFile(null);
    setAchievementPhotoUploading(false);
  };

  const resetStaffPhotoSelection = () => {
    if (staffPhotoPreviewUrl) {
      URL.revokeObjectURL(staffPhotoPreviewUrl);
    }
    setStaffPhotoPreviewUrl('');
    setStaffPhotoFileName('');
    setPendingStaffPhotoFile(null);
    setStaffPhotoUploading(false);
  };

  const resetAlumniPhotoSelection = () => {
    if (alumniPhotoPreviewUrl) {
      URL.revokeObjectURL(alumniPhotoPreviewUrl);
    }
    setAlumniPhotoPreviewUrl('');
    setAlumniPhotoFileName('');
    setPendingAlumniPhotoFile(null);
    setAlumniPhotoUploading(false);
  };

  const resetGalleryPhotoSelection = () => {
    galleryPhotoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setGalleryPhotoPreviewUrls([]);
    setGalleryPhotoFileNames([]);
    setPendingGalleryPhotoFiles([]);
    setGalleryPhotoUploading(false);
  };

  const openAddStaff = () => {
    resetStaffPhotoSelection();
    setStaffErrors({});
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
      image: '',
      schoolId: schoolInfo?.id || schoolId || '',
    });
    setStaffDialog(true);
  };

  const openEditStaff = (staff: StaffMember) => {
    resetStaffPhotoSelection();
    setStaffErrors({});
    setEditingStaff({ ...staff });
    setStaffDialog(true);
  };

  const closeStaffDialog = () => {
    setStaffDialog(false);
    setEditingStaff(null);
    setStaffErrors({});
    resetStaffPhotoSelection();
  };

  const saveStaffMember = async () => {
    if (!editingStaff) return;

    const trimmedName = (editingStaff.name || '').trim();
    const trimmedDepartment = (editingStaff.department || '').trim();
    const trimmedPosition = (editingStaff.position || '').trim();
    const trimmedEducation = (editingStaff.education || '').trim();
    const trimmedExperience = (editingStaff.experience || '').trim();
    const trimmedSpecializations = (editingStaff.specializations || '').trim();
    const trimmedEmail = (editingStaff.email || '').trim();
    const trimmedPhone = (editingStaff.phone || '').trim();

    const errors: StaffFormErrors = {};

    if (!trimmedName) errors.name = 'Name is required.';
    if (!trimmedDepartment) errors.department = 'Department is required.';
    if (!trimmedPosition) errors.position = 'Position is required.';
    if (!trimmedEducation) errors.education = 'Education is required.';
    if (!trimmedExperience) errors.experience = 'Experience is required.';
    if (!trimmedSpecializations) errors.specializations = 'Specializations are required.';
    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Enter a valid staff email address.';
    }
    if (trimmedPhone && !PHONE_REGEX.test(trimmedPhone)) {
      errors.phone = 'Use numbers and + - ( ) spaces only for staff phone numbers.';
    }

    if (Object.keys(errors).length > 0) {
      setStaffErrors(errors);
      return;
    }

    setStaffErrors({});

    setIsSaving(true);

    const targetSchoolId = schoolId || 'educonnect';
    let image = (editingStaff.image || '').trim();

    try {
      if (pendingStaffPhotoFile) {
        setStaffPhotoUploading(true);
        const folder = `schools/${targetSchoolId}`;
        const { secureUrl } = await uploadImageToCloudinary(pendingStaffPhotoFile, {
          folder,
        });
        image = secureUrl;
      } else if (!image) {
        image = '';
      }

      const staffEntry: StaffMember = {
        id: editingStaff.id || `staff-${Date.now()}`,
        name: trimmedName,
        department: trimmedDepartment,
        position: trimmedPosition,
        education: trimmedEducation,
        specializations: trimmedSpecializations,
        experience: trimmedExperience,
        email: trimmedEmail,
        phone: trimmedPhone,
        image,
        schoolId: editingStaff.schoolId || schoolInfo?.id || schoolId || '',
      };
      const updatedList = editingStaff.id
        ? staffMembers.map((s) => (s.id === editingStaff.id ? staffEntry : s))
        : [...staffMembers, staffEntry];

      await updateStaffPageContent(targetSchoolId, updatedList);
      setStaffMembers(updatedList);
      closeStaffDialog();
      await refreshSchoolData();
      showSuccess('Staff member saved successfully!');

    } catch (error) {
      console.error('Failed to save staff member:', error);
      showError('Failed to save staff member. Please try again.');
      await refreshSchoolData();
    } finally {
      setStaffPhotoUploading(false);
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
    resetAlumniPhotoSelection();
    setAlumniErrors({});
    setEditingAlumni({
      id: '',
      name: '',
      company: '',
      currentPosition: '',
      graduationYear: '',
      image: '',
      industry: 'Other',
      location: '',
      linkedinUrl: '',
    });
    setAlumniDialog(true);
  };

  const openEditAlumni = (alumni: AlumniMember) => {
    resetAlumniPhotoSelection();
    setAlumniErrors({});
    setEditingAlumni({ ...alumni });
    setAlumniDialog(true);
  };

  const closeAlumniDialog = () => {
    setAlumniDialog(false);
    setEditingAlumni(null);
    setAlumniErrors({});
    resetAlumniPhotoSelection();
  };

  const saveAlumniMember = async () => {
    if (!editingAlumni) return;

    const trimmedName = (editingAlumni.name || '').trim();
    const trimmedCompany = (editingAlumni.company || '').trim();
    const trimmedPosition = (editingAlumni.currentPosition || '').trim();
    const trimmedGraduationYear = (editingAlumni.graduationYear || '').trim();
    const trimmedLinkedIn = (editingAlumni.linkedinUrl || '').trim();
    const trimmedIndustry = (editingAlumni.industry || '').trim();
    const trimmedLocation = (editingAlumni.location || '').trim();

    const errors: AlumniFormErrors = {};

    if (!trimmedName) {
      errors.name = 'Name is required.';
    }

    if (!trimmedGraduationYear) {
      errors.graduationYear = 'Graduation year is required.';
    } else if (!GRADUATION_YEAR_REGEX.test(trimmedGraduationYear)) {
      errors.graduationYear = 'Enter a four-digit graduation year.';
    }

    if (trimmedLinkedIn && !LINKEDIN_URL_REGEX.test(trimmedLinkedIn)) {
      errors.linkedinUrl = 'Enter a valid LinkedIn URL (include https://).';
    }

    if (Object.keys(errors).length > 0) {
      setAlumniErrors(errors);
      return;
    }

    setAlumniErrors({});

    setIsSaving(true);

    const targetSchoolId = schoolId || 'educonnect';
    let image = (editingAlumni.image || '').trim();

    try {
      if (pendingAlumniPhotoFile) {
        setAlumniPhotoUploading(true);
        const folder = `schools/${targetSchoolId}`;
        const { secureUrl } = await uploadImageToCloudinary(pendingAlumniPhotoFile, { folder });
        image = secureUrl;
      } else if (!image) {
        image = '';
      }

      const alumniEntry: AlumniMember = {
        id: editingAlumni.id || `alumni-${Date.now()}`,
        name: trimmedName,
        company: trimmedCompany,
        currentPosition: trimmedPosition,
        graduationYear: trimmedGraduationYear,
        image,
        industry: trimmedIndustry || 'Other',
        location: trimmedLocation,
        linkedinUrl: trimmedLinkedIn,
      };
      const updatedList = editingAlumni.id
        ? alumniMembers.map((a) => (a.id === editingAlumni.id ? alumniEntry : a))
        : [...alumniMembers, alumniEntry];

      await updateAlumniPageContent(targetSchoolId, updatedList);
      setAlumniMembers(updatedList);
      closeAlumniDialog();
      await refreshSchoolData();
      showSuccess('Alumni entry saved successfully!');
    } catch (error) {
      console.error('Failed to save alumni entry:', error);
      showError('Failed to save alumni entry. Please try again.');
      await refreshSchoolData();
    } finally {
      setAlumniPhotoUploading(false);
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
    resetGalleryPhotoSelection();
    setGalleryErrors({});
    setEditingGallery({
      id: '',
      title: '',
      category: GALLERY_CATEGORY_OPTIONS[0].value,
      description: '',
      date: '',
      images: [],
      videoUrl: '',
      type: 'image',
    });
    setGalleryDialog(true);
  };

  const openEditGalleryImage = (image: GalleryImage) => {
    resetGalleryPhotoSelection();
    setGalleryErrors({});
    const normalizedImages = Array.isArray(image.images)
      ? image.images.filter((url) => typeof url === 'string' && url.trim().length > 0)
      : [];
    setEditingGallery({
      ...image,
      images: normalizedImages,
      category: resolveGalleryCategoryLabel(image.category),
      videoUrl: image.videoUrl || '',
      type: image.videoUrl ? 'video' : image.type || 'image',
    });
    setGalleryDialog(true);
  };

  const closeGalleryDialog = () => {
    setGalleryDialog(false);
    setEditingGallery(null);
    setGalleryErrors({});
    resetGalleryPhotoSelection();
  };

  const saveGalleryImage = async () => {
    if (!editingGallery) return;

    const trimmedTitle = (editingGallery.title || '').trim();
    const trimmedDescription = (editingGallery.description || '').trim();
    const existingImages = Array.isArray(editingGallery.images)
      ? editingGallery.images.filter((url) => typeof url === 'string' && url.trim().length > 0)
      : [];
    const trimmedVideoUrl = (editingGallery.videoUrl || '').trim();

    const errors: GalleryFormErrors = {};

    if (!trimmedTitle) {
      errors.title = 'Title is required.';
    }

    if (!trimmedDescription) {
      errors.description = 'Description is required.';
    }

    if (trimmedVideoUrl && !isValidYouTubeUrl(trimmedVideoUrl)) {
      errors.videoUrl = 'Please enter a valid YouTube video link (e.g., https://youtu.be/...).';
    }

    if (Object.keys(errors).length > 0) {
      setGalleryErrors(errors);
      return;
    }

    setGalleryErrors({});

    setIsSaving(true);

    const targetSchoolId = schoolId || 'educonnect';
    let images = [...existingImages];

    try {
      if (pendingGalleryPhotoFiles.length > 0) {
        setGalleryPhotoUploading(true);
        const folder = `schools/${targetSchoolId}`;
        for (const file of pendingGalleryPhotoFiles) {
          const { secureUrl } = await uploadImageToCloudinary(file, { folder });
          images.push(secureUrl);
        }
      }

      const resolvedCategory = resolveGalleryCategoryLabel(editingGallery.category);
      const galleryEntry: GalleryImage = {
        ...editingGallery,
        id: editingGallery.id || `gallery-${Date.now()}`,
        title: trimmedTitle,
        description: trimmedDescription,
        category: resolvedCategory,
        images,
        videoUrl: trimmedVideoUrl,
        type: trimmedVideoUrl ? 'video' : 'image',
      };
      const updatedList = editingGallery.id
        ? galleryImages.map((image) => (image.id === editingGallery.id ? galleryEntry : image))
        : [...galleryImages, galleryEntry];
      const normalizedList = updatedList.map((image) => ({
        ...image,
        category: resolveGalleryCategoryLabel(image.category),
        description: (image.description || '').trim(),
        images: Array.isArray(image.images)
          ? image.images.filter((url) => typeof url === 'string' && url.trim().length > 0)
          : [],
        videoUrl: (image.videoUrl || '').trim() || '',
        type: (image.videoUrl || '').trim() ? 'video' : 'image',
      }));

      await updateGalleryPageContent(targetSchoolId, normalizedList);
      setGalleryImages(normalizedList);
      closeGalleryDialog();
      await refreshSchoolData();
      showSuccess('Gallery item saved successfully!');
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      showError('Failed to save gallery item. Please try again.');
      await refreshSchoolData();
    } finally {
      setGalleryPhotoUploading(false);
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
    setAnnouncementErrors({});
    setEditingAnnouncement({
      id: '',
      title: '',
      description: '',
      date: '',
      category: '',
      priority: 'medium',
      type: 'announcement',
      audience: '',
      isPinned: false,
      isUrgent: false,
      author: '',
      tags: [],
    });
    setAnnouncementDialog(true);
  };

  const openEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementErrors({});
    setEditingAnnouncement({
      ...announcement,
      category: announcement.category || '',
      priority: (announcement.priority || 'medium').toLowerCase(),
      type: (announcement.type || 'announcement').toLowerCase(),
    });
    setAnnouncementDialog(true);
  };

  const saveAnnouncement = async () => {
    if (!editingAnnouncement) return;

    const trimmedTitle = (editingAnnouncement.title || '').trim();
    const trimmedDescription = (editingAnnouncement.description || '').trim();
    const trimmedDate = (editingAnnouncement.date || '').trim();

    const errors: AnnouncementFormErrors = {};

    if (!trimmedTitle) {
      errors.title = 'Title is required.';
    }

    if (!trimmedDescription) {
      errors.description = 'Description is required.';
    }

    if (Object.keys(errors).length > 0) {
      setAnnouncementErrors(errors);
      return;
    }

    setAnnouncementErrors({});

    const categories = normalizeAnnouncementCategoryList([
      editingAnnouncement.category,
    ]);
    const primaryCategory = categories[0] || '';
    const announcementEntry: Announcement = {
      ...editingAnnouncement,
      id: editingAnnouncement.id || `announcement-${Date.now()}`,
      title: trimmedTitle,
      description: trimmedDescription,
      date: trimmedDate,
      category: primaryCategory,
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
    { id: 'contact', label: 'Contact Us', icon: Mail },
    ...(userProfile?.role === 'super-admin' ? [{ id: 'users', label: 'User Management', icon: SupervisorAccount }] : [])
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
            {activePage === 'home' && homeData && (() => {
              const homeOverviewItems = [
                { key: 'title', title: 'Welcome Title', icon: <Home fontSize='small' />, lines: getHomeDisplayLines('title') },
                { key: 'subtitle', title: 'Welcome Subtitle', icon: <Megaphone fontSize='small' />, lines: getHomeDisplayLines('subtitle') },
                { key: 'principalName', title: 'Principal Name', icon: <School fontSize='small' />, lines: getHomeDisplayLines('principalName') },
                { key: 'principalMessage', title: "Principal's Message", icon: <Mail fontSize='small' />, lines: getHomeDisplayLines('principalMessage') },
                { key: 'principalPhoto', title: 'Principal Photo', icon: <PhotoCamera fontSize='small' />, lines: [] },
                { key: 'homeHeroImages', title: 'Home Images', icon: <ImageIcon fontSize='small' />, lines: [] },
              ];

              const homeMetricsItems = [
                { key: 'students', title: 'Students', icon: <Users fontSize='small' />, lines: getHomeDisplayLines('students') },
                { key: 'teachers', title: 'Teachers', icon: <SupervisorAccount fontSize='small' />, lines: getHomeDisplayLines('teachers') },
                { key: 'yearEstablished', title: 'Year Established', icon: <AccessTime fontSize='small' />, lines: getHomeDisplayLines('yearEstablished') },
                { key: 'successRate', title: 'Success Rate', icon: <Trophy fontSize='small' />, lines: getHomeDisplayLines('successRate') },
              ];

              const accordionBaseSx = {
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                border: '1px solid rgba(25,118,210,0.14)',
                background: 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0.015) 60%)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
                transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(25,118,210,0.32)',
                  boxShadow: '0 22px 48px rgba(15,23,42,0.16)',
                  transform: 'translateY(-2px)',
                },
                '&.Mui-expanded': {
                  borderColor: 'rgba(25,118,210,0.4)',
                  boxShadow: '0 22px 52px rgba(15,23,42,0.2)',
                },
                '&:before': { display: 'none' },
                '& + &': { mt: 2.5 },
              } as const;

              const accordionDetailsSx = {
                px: { xs: 2.5, md: 3 },
                pb: 3,
                pt: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 60%)',
                borderTop: '1px solid rgba(255,255,255,0.12)',
              } as const;

              const summarySx = {
                px: { xs: 2.5, md: 3 },
                py: 2,
                '& .MuiAccordionSummary-content': {
                  m: 0,
                },
                '& .MuiAccordionSummary-expandIconWrapper': {
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(25,118,210,0.08)',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 24px rgba(25,118,210,0.2)',
                  transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                },
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                },
              } as const;

              const journeyMetaLabel =
                journeyMilestones.length > 0
                  ? formatCountLabel(journeyMilestones.length, 'milestone')
                  : 'Add milestone';

              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Accordion
                    disableGutters
                    elevation={0}
                    expanded={expandedHomeSection === 'overview'}
                    onChange={handleHomeSectionToggle('overview')}
                    sx={accordionBaseSx}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={summarySx}
                    >
                      {renderHomeAccordionSummary(
                        <Home fontSize="small" />,
                        'Home Overview',
                        'Update the hero welcome content and principal message.',
                        formatCountLabel(homeOverviewItems.length, 'field')
                      )}
                    </AccordionSummary>
                    <AccordionDetails sx={accordionDetailsSx}>
                      {renderSummaryGrid('home', homeOverviewItems)}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    disableGutters
                    elevation={0}
                    expanded={expandedHomeSection === 'metrics'}
                    onChange={handleHomeSectionToggle('metrics')}
                    sx={accordionBaseSx}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={summarySx}
                    >
                      {renderHomeAccordionSummary(
                        <TrendingUp fontSize="small" />,
                        'Key Metrics',
                        'These stats display on the home page banner.',
                        formatCountLabel(homeMetricsItems.length, 'metric')
                      )}
                    </AccordionSummary>
                    <AccordionDetails sx={accordionDetailsSx}>
                      {renderSummaryGrid('home', homeMetricsItems, { columns: { md: 4, lg: 4 } })}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    disableGutters
                    elevation={0}
                    expanded={expandedHomeSection === 'journey'}
                    onChange={handleHomeSectionToggle('journey')}
                    sx={accordionBaseSx}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={summarySx}
                    >
                      {renderHomeAccordionSummary(
                        <WorkspacePremium fontSize="small" />,
                        'Our Journey',
                        'Capture the milestones that define your school\'s story.',
                        journeyMetaLabel
                      )}
                    </AccordionSummary>
                    <AccordionDetails sx={accordionDetailsSx}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'center' },
                          justifyContent: 'space-between',
                          gap: 2,
                          mb: 2.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Showcase pivotal years, achievements, and growth moments to appear on the public timeline.
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={openAddJourney}
                          disabled={isSaving}
                          startIcon={<Plus fontSize="small" />}
                          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                        >
                          Add Journey
                        </Button>
                      </Box>
                      {journeyMilestones.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No milestones yet. Use "Add Journey" to highlight key moments in your history.
                        </Typography>
                      ) : (
                        <Stack spacing={2.5}>
                          {journeyMilestones.map((milestone) => (
                            <Card
                              key={milestone.id}
                              variant="outlined"
                              sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: 2,
                                border: '1px solid rgba(255,255,255,0.14)',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(14px)',
                                boxShadow: '0 12px 24px rgba(15,23,42,0.18)',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 60%)',
                                  opacity: 0.65,
                                },
                                '& > *': {
                                  position: 'relative',
                                },
                              }}
                            >
                              <CardContent
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 1.5,
                                  py: 2.5,
                                  px: { xs: 2, sm: 2.5 },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: { xs: 1, sm: 1.5 },
                                  }}
                                >
                                  <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Chip label={milestone.year || 'Year'} size="small" sx={{ fontWeight: 600 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {milestone.title || 'Untitled Milestone'}
                                    </Typography>
                                  </Stack>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      disabled={isSaving}
                                      onClick={() => openEditJourney(milestone)}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      disabled={isSaving}
                                      onClick={() => deleteJourneyMilestone(milestone.id)}
                                    >
                                      <Trash2 fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {milestone.description || 'No description provided.'}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })()}

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
                        <TableCell sx={tableHeaderSx}>Date</TableCell>
                        <TableCell sx={tableHeaderSx}>Level</TableCell>
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
                          <TableCell>{achievement.date}</TableCell>
                          <TableCell>
                            {renderLevelChip(achievement.level)}
                          </TableCell>
                        <TableCell sx={{ maxWidth: 320 }}>
                          <Box
                            sx={{
                              maxHeight: 48,
                              overflow: 'hidden',
                              pr: 1,
                              transition: 'max-height 0.2s ease',
                              '&:hover': {
                                maxHeight: 200,
                                overflowY: 'auto',
                                '& .description-text': {
                                  display: 'block',
                                  WebkitLineClamp: 'unset',
                                },
                              },
                            }}
                          >
                            <Typography
                              variant="body2"
                              className="description-text"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                              }}
                            >
                              {achievement.description || '—'}
                            </Typography>
                          </Box>
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
                        <TableCell sx={tableHeaderSx}>Position</TableCell>
                        <TableCell sx={tableHeaderSx}>Experience</TableCell>
                        <TableCell sx={tableHeaderSx}>Department</TableCell>
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
                          <TableCell>{staff.position}</TableCell>
                          <TableCell>{staff.experience}</TableCell>
                          <TableCell>
                            <Chip sx={{ fontWeight: 600 }} label={staff.department} size="small" />
                          </TableCell>
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
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {image.title}
                              </Typography>
                              {image.videoUrl && (
                                <Chip
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  icon={<PlayCircleOutline fontSize="small" />}
                                  label="Video"
                                  component="a"
                                  href={image.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  clickable
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              sx={{ fontWeight: 600 }}
                              label={getGalleryCategoryLabel(image.category)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{image.date}</TableCell>
                          <TableCell sx={{ maxWidth: 320 }}>
                            <Box
                              sx={{
                                maxHeight: 48,
                                overflow: 'hidden',
                                pr: 1,
                                transition: 'max-height 0.2s ease',
                                '&:hover': {
                                  maxHeight: 200,
                                  overflowY: 'auto',
                                  '& .description-text': {
                                    display: 'block',
                                    WebkitLineClamp: 'unset',
                                  },
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                className="description-text"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'normal',
                                }}
                              >
                                {image.description || '—'}
                              </Typography>
                            </Box>
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
                {/* Header Section */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      Announcements
                    </Typography>
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

                {/* Table Section */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={tableHeaderSx}>Title</TableCell>
                        <TableCell sx={tableHeaderSx}>Category</TableCell>
                        <TableCell sx={tableHeaderSx}>Audience</TableCell>
                        <TableCell sx={tableHeaderSx}>Date</TableCell>
                        <TableCell sx={tableHeaderSx}>Priority</TableCell>
                        <TableCell sx={tableHeaderSx}>Pinned</TableCell>
                        <TableCell sx={tableHeaderSx}>Urgent</TableCell>
                        <TableCell sx={tableHeaderSx}>Author</TableCell>
                        <TableCell sx={{ ...tableHeaderSx, textAlign: 'right' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {/* No announcements */}
                      {announcements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              align="center"
                            >
                              No announcements found. Use "Add Announcement" to create one.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Announcements List */}
                      {announcements.map((announcement) => (
                        <TableRow key={announcement.id}>
                          {/* Title */}
                          <TableCell>{announcement.title}</TableCell>

                          {/* Category */}
                          <TableCell>
                            <Chip
                              label={
                                announcement.category
                                  ? formatAnnouncementCategoryLabel(announcement.category)
                                  : 'Uncategorized'
                              }
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>

                          {/* Audience */}
                          <TableCell>
                            <Chip
                              label={
                                announcement.audience
                                  ? announcement.audience.charAt(0).toUpperCase() +
                                    announcement.audience.slice(1)
                                  : 'All'
                              }
                              size="small"
                              color="info"
                            />
                          </TableCell>

                          {/* Date */}
                          <TableCell>{announcement.date || '—'}</TableCell>

                          {/* Priority */}
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
                                  label={priorityLabel}
                                  size="small"
                                  color={chipColor}
                                  sx={{ fontWeight: 600 }}
                                />
                              );
                            })()}
                          </TableCell>

                          {/* isPinned */}
                          <TableCell>
                            {announcement.isPinned ? (
                              <Chip label="Pinned" color="success" size="small" />
                            ) : (
                              <Chip label="No" size="small" variant="outlined" />
                            )}
                          </TableCell>

                          {/* isUrgent */}
                          <TableCell>
                            {announcement.isUrgent ? (
                              <Chip label="Urgent" color="error" size="small" />
                            ) : (
                              <Chip label="No" size="small" variant="outlined" />
                            )}
                          </TableCell>

                          {/* Author */}
                          <TableCell>
                            {announcement.author ? (
                              <Typography variant="body2" fontWeight={600}>
                                {announcement.author}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                —
                              </Typography>
                            )}
                          </TableCell>

                          {/* Actions */}
                          <TableCell align="right">
                            <Box
                              sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
                            >
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
            {activePage === 'contact' && contactData && (() => {
              const contactSummaryItems = [
                { key: 'address', title: 'Address', icon: <LocationOn fontSize='small' />, lines: getContactDisplayLines('address') },
                { key: 'phone', title: 'Phone', icon: <PhoneIcon fontSize='small' />, lines: getContactDisplayLines('phone') },
                { key: 'email', title: 'Email', icon: <EmailIcon fontSize='small' />, lines: getContactDisplayLines('email') },
                { key: 'hours', title: 'Office Hours', icon: <AccessTime fontSize='small' />, lines: getContactDisplayLines('hours') },
                { key: 'whatsapp', title: 'WhatsApp', icon: <WhatsAppIcon fontSize='small' />, lines: getContactDisplayLines('whatsapp') },
                { key: 'facebook', title: 'Facebook', icon: <FacebookIcon fontSize='small' />, lines: getContactDisplayLines('facebook') },
                { key: 'instagram', title: 'Instagram', icon: <InstagramIcon fontSize='small' />, lines: getContactDisplayLines('instagram') },
              ];

              return (
                <Card>
                  <CardHeader
                    title={<Typography variant="h5">Contact Information</Typography>}
                    subheader="Tap the pencil to edit each contact channel. Changes save instantly."
                  />
                  <CardContent>
                    {renderSummaryGrid('contact', contactSummaryItems)}
                  </CardContent>
                </Card>
              );
            })()}

            {/* User Management Page (Super Admin Only) */}
            {activePage === 'users' && userProfile?.role === 'super-admin' && (
              <Card>
                <CardHeader
                  title={<Typography variant="h5">User Management</Typography>}
                  subheader="Manage user access and permissions for all schools"
                />
                <CardContent>
                  <UserManagement 
                    availableSchools={[
                      { id: schoolId || 'educonnect', name: schoolInfo?.name || 'School' },
                      // Add more schools here when supporting multiple schools
                    ]} 
                  />
                </CardContent>
              </Card>
            )}
      </Box>
    </Box>
  </Box>

      {/* Journey Dialog */}
      <Dialog
        open={journeyDialog}
        onClose={closeJourneyDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingJourney?.id ? 'Edit Journey Milestone' : 'Add Journey Milestone'}
        </DialogTitle>
        <DialogContent>
          {editingJourney && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Year"
                value={editingJourney.year}
                onChange={(e) =>
                  setEditingJourney({ ...editingJourney, year: e.target.value })
                }
                placeholder="e.g., 2024"
              />
              <TextField
                fullWidth
                label="Title"
                value={editingJourney.title}
                onChange={(e) =>
                  setEditingJourney({ ...editingJourney, title: e.target.value })
                }
                placeholder="Milestone title"
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editingJourney.description}
                onChange={(e) =>
                  setEditingJourney({ ...editingJourney, description: e.target.value })
                }
                placeholder="Describe what happened during this year"
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJourneyDialog} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveJourneyMilestone}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingJourney?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Achievement Dialog */}
      <Dialog 
        open={achievementDialog} 
        onClose={(_, reason) => {
          if (isSaving && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
            return;
          }
          closeAchievementDialog();
        }}
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
                  required
                  value={editingAchievement.title}
                  onChange={handleAchievementInputChange('title')}
                  placeholder="Achievement title"
                  error={Boolean(achievementErrors.title)}
                  helperText={achievementErrors.title}
                />
                <FormControl fullWidth>
                  <InputLabel id="achievement-level-label">Level</InputLabel>
                  <Select
                    labelId="achievement-level-label"
                    value={editingAchievement.level || 'others'}
                    label="Level"
                    onChange={(e) =>
                      setEditingAchievement({
                        ...editingAchievement,
                       level: (e.target.value as string) || 'others',
                      })
                    }
                  >
                    {achievementLevelOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="achievement-section-label">Section</InputLabel>
                <Select
                  labelId="achievement-section-label"
                  value={editingAchievement.sectionKey || 'general'}
                  label="Section"
                  onChange={(e) =>
                    setEditingAchievement({
                      ...editingAchievement,
                      sectionKey: e.target.value as string,
                      sectionTitle: getAchievementSectionLabel(e.target.value as string),
                    })
                  }
                >
                  {achievementSectionOptions.map((option) => (
                    <MenuItem key={option.key} value={option.key}>
                      {option.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                required
                value={editingAchievement.description}
                onChange={handleAchievementInputChange('description')}
                placeholder="Describe the achievement"
                error={Boolean(achievementErrors.description)}
                helperText={achievementErrors.description}
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                required
                value={editingAchievement.date}
                onChange={handleAchievementInputChange('date')}
                InputLabelProps={{ shrink: true }}
                error={Boolean(achievementErrors.date)}
                helperText={achievementErrors.date}
              />

               {/* Image Upload Section */}
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Achievement Image
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Avatar
                    src={achievementPhotoPreviewUrl || editingAchievement.image || undefined}
                    alt={editingAchievement.title || 'Achievement image'}
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: 32,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {!achievementPhotoPreviewUrl &&
                      !editingAchievement.image &&
                      editingAchievement.title
                      ? editingAchievement.title.charAt(0).toUpperCase()
                      : undefined}
                  </Avatar>

                  <Stack spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'flex-start' }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ fontWeight: 600 }}
                        disabled={achievementPhotoChooseDisabled}
                      >
                        Choose Image
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleAchievementPhotoSelect}
                          disabled={achievementPhotoChooseDisabled}
                        />
                      </Button>

                      {(pendingAchievementPhotoFile || editingAchievement.image) && (
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={handleAchievementPhotoRemove}
                          disabled={achievementPhotoRemoveDisabled}
                          sx={{ alignSelf: 'flex-start', px: 0 }}
                        >
                          Remove photo
                        </Button>
                      )}
                  </Stack>

                  {achievementPhotoFileName ? (
                  <Typography variant="body2" color="text.secondary">
                    Selected file: {achievementPhotoFileName}. The image uploads when you save.
                  </Typography>
                ) : hasExistingAchievementPhoto ? (
                  <Typography variant="body2" color="text.secondary">
                    Existing image in use. Click remove to replace it.
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No image selected yet.
                  </Typography>
                )}
                    <Typography variant="caption" color="text.secondary">
                    Upload a clear PNG or JPG up to 5 MB.
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAchievementDialog} disabled={isSaving}>
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
        onClose={closeStaffDialog}
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
                required
                value={editingStaff.name}
                onChange={handleStaffInputChange('name')}
                placeholder="Full name"
                error={Boolean(staffErrors.name)}
                helperText={staffErrors.name}
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Department"
                  required
                  value={editingStaff.department}
                  onChange={handleStaffInputChange('department')}
                  placeholder="e.g., Mathematics"
                  error={Boolean(staffErrors.department)}
                  helperText={staffErrors.department}
                />
                <TextField
                  fullWidth
                  label="Position"
                  required
                  value={editingStaff.position}
                  onChange={handleStaffInputChange('position')}
                  placeholder="e.g., Senior Teacher"
                  error={Boolean(staffErrors.position)}
                  helperText={staffErrors.position}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Experience"
                  required
                  value={editingStaff.experience}
                  onChange={handleStaffInputChange('experience')}
                  placeholder="e.g., 10 years"
                  error={Boolean(staffErrors.experience)}
                  helperText={staffErrors.experience}
                />
                <TextField
                  fullWidth
                  label="Education"
                  required
                  value={editingStaff.education}
                  onChange={handleStaffInputChange('education')}
                  placeholder="e.g., M.Ed"
                  error={Boolean(staffErrors.education)}
                  helperText={staffErrors.education}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editingStaff.email}
                  onChange={handleStaffInputChange('email')}
                  placeholder="name@school.edu"
                  error={Boolean(staffErrors.email)}
                  helperText={staffErrors.email}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={editingStaff.phone}
                  onChange={handleStaffInputChange('phone')}
                  placeholder="+1 555 123 4567"
                  error={Boolean(staffErrors.phone)}
                  helperText={staffErrors.phone}
                />
              </Box>
              <TextField
                fullWidth
                label="Specializations (comma separated)"
                required
                value={editingStaff.specializations}
                onChange={handleStaffInputChange('specializations')}
                placeholder="Mathematics, Algebra"
                error={Boolean(staffErrors.specializations)}
                helperText={staffErrors.specializations}
              />
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Profile Photo
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Avatar
                    src={staffPhotoPreviewUrl || editingStaff.image || undefined}
                    alt={editingStaff.name || 'Staff photo'}
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: 32,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {!staffPhotoPreviewUrl &&
                      !editingStaff.image &&
                      editingStaff.name
                      ? editingStaff.name.charAt(0).toUpperCase()
                      : undefined}
                  </Avatar>
                  <Stack spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'flex-start' }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ fontWeight: 600 }}
                        disabled={staffPhotoChooseDisabled}
                      >
                        Choose Image
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleStaffPhotoSelect}
                          disabled={staffPhotoChooseDisabled}
                        />
                      </Button>
                      {(pendingStaffPhotoFile || editingStaff.image) && (
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={handleStaffPhotoRemove}
                          disabled={staffPhotoRemoveDisabled}
                          sx={{ alignSelf: 'flex-start', px: 0 }}
                        >
                          Remove photo
                        </Button>
                      )}
                    </Stack>
                    {staffPhotoFileName ? (
                      <Typography variant="body2" color="text.secondary">
                        Selected file: {staffPhotoFileName}. The image uploads when you save.
                      </Typography>
                    ) : hasExistingStaffPhoto ? (
                      <Typography variant="body2" color="text.secondary">
                        Existing photo in use. Click remove to replace it.
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No photo selected yet.
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Upload a clear PNG or JPG portrait up to 5 MB.
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStaffDialog} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveStaffMember}
            disabled={isSaving || staffPhotoUploading}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingStaff?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alumni Dialog */}
      <Dialog
        open={alumniDialog}
        onClose={closeAlumniDialog}
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
                required
                value={editingAlumni.name}
                onChange={handleAlumniInputChange('name')}
                placeholder="Full name"
                error={Boolean(alumniErrors.name)}
                helperText={alumniErrors.name}
              />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Graduation Year"
                  required
                  value={editingAlumni.graduationYear}
                  onChange={handleAlumniInputChange('graduationYear')}
                  placeholder="e.g., 2010"
                  inputProps={{ inputMode: 'numeric', pattern: '\\d{4}' }}
                  error={Boolean(alumniErrors.graduationYear)}
                  helperText={alumniErrors.graduationYear}
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
                  onChange={handleAlumniInputChange('linkedinUrl')}
                  placeholder="https://linkedin.com/in/example"
                  error={Boolean(alumniErrors.linkedinUrl)}
                  helperText={alumniErrors.linkedinUrl}
                />
              </Box>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Profile Photo
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Avatar
                    src={alumniPhotoPreviewUrl || editingAlumni.image || undefined}
                    alt={editingAlumni.name || 'Alumni photo'}
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: 32,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {!alumniPhotoPreviewUrl &&
                      !editingAlumni.image &&
                      editingAlumni.name
                      ? editingAlumni.name.charAt(0).toUpperCase()
                      : undefined}
                  </Avatar>
                  <Stack spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'flex-start' }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ fontWeight: 600 }}
                        disabled={alumniPhotoChooseDisabled}
                      >
                        Choose Image
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleAlumniPhotoSelect}
                          disabled={alumniPhotoChooseDisabled}
                        />
                      </Button>
                      {(pendingAlumniPhotoFile || editingAlumni.image) && (
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={handleAlumniPhotoRemove}
                          disabled={alumniPhotoRemoveDisabled}
                          sx={{ alignSelf: 'flex-start', px: 0 }}
                        >
                          Remove photo
                        </Button>
                      )}
                    </Stack>
                    {alumniPhotoFileName ? (
                      <Typography variant="body2" color="text.secondary">
                        Selected file: {alumniPhotoFileName}. The image uploads when you save.
                      </Typography>
                    ) : hasExistingAlumniPhoto ? (
                      <Typography variant="body2" color="text.secondary">
                        Existing photo in use. Click remove to replace it.
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No photo selected yet.
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Upload a clear PNG or JPG portrait up to 5 MB.
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlumniDialog} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveAlumniMember}
            disabled={isSaving || alumniPhotoUploading}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isSaving ? 'Saving...' : editingAlumni?.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog
        open={galleryDialog}
        onClose={closeGalleryDialog}
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
                required
                value={editingGallery.title}
                onChange={handleGalleryInputChange('title')}
                placeholder="Gallery item title"
                error={Boolean(galleryErrors.title)}
                helperText={galleryErrors.title}
              />
              <FormControl fullWidth>
                <InputLabel id="gallery-category-label">Category</InputLabel>
                <Select
                  labelId="gallery-category-label"
                  label="Category"
                  value={editingGallery.category || ''}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const value = typeof event.target.value === 'string' ? event.target.value : '';
                    setEditingGallery({
                      ...editingGallery,
                      category: resolveGalleryCategoryLabel(value),
                    });
                  }}
                >
                  {GALLERY_CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={editingGallery.date}
                onChange={(e) => setEditingGallery({ ...editingGallery, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Existing Images
                  </Typography>
                  {hasExistingGalleryPhoto ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(editingGallery.images || []).map((url, index) => (
                        <Stack
                          key={`gallery-existing-${index}`}
                          spacing={0.5}
                          alignItems="center"
                          sx={{ width: 160 }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              height: 110,
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: '1px solid rgba(255,255,255,0.12)',
                              bgcolor: 'rgba(255,255,255,0.04)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              component="img"
                              src={url}
                              alt={`${editingGallery.title || 'Gallery image'} ${index + 1}`}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Button
                            size="small"
                            variant="text"
                            color="error"
                            onClick={() => removeExistingGalleryPhoto(index)}
                            disabled={galleryPhotoRemoveDisabled}
                            sx={{ px: 0 }}
                          >
                            Remove
                          </Button>
                        </Stack>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No images saved yet. Upload one or more images to populate this gallery entry.
                    </Typography>
                  )}
                </Box>

                {galleryPhotoPreviewUrls.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Pending Uploads
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {galleryPhotoPreviewUrls.map((previewUrl, index) => (
                        <Stack
                          key={`gallery-pending-${index}`}
                          spacing={0.5}
                          alignItems="center"
                          sx={{ width: 160 }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              height: 110,
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: '1px solid rgba(255,255,255,0.12)',
                              bgcolor: 'rgba(255,255,255,0.04)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              component="img"
                              src={previewUrl}
                              alt={`Pending gallery image ${index + 1}`}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {galleryPhotoFileNames[index]}
                          </Typography>
                          <Button
                            size="small"
                            variant="text"
                            color="error"
                            onClick={() => removePendingGalleryPhoto(index)}
                            disabled={galleryPhotoRemoveDisabled}
                            sx={{ px: 0 }}
                          >
                            Remove pending
                          </Button>
                        </Stack>
                      ))}
                    </Box>
                  </Box>
                )}

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ fontWeight: 600 }}
                    disabled={galleryPhotoChooseDisabled}
                  >
                    Add Images
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryPhotoSelect}
                      disabled={galleryPhotoChooseDisabled}
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Upload clear PNG or JPG files up to 5 MB each. Files are stored in Cloudinary and the secure URLs save
                    with this gallery item when you click Save.
                  </Typography>
                </Stack>
              </Stack>
              <TextField
                fullWidth
                label="YouTube Video URL"
                type="url"
                value={editingGallery.videoUrl || ''}
                onChange={handleGalleryInputChange('videoUrl')}
                placeholder="https://youtu.be/your-video"
                error={Boolean(galleryErrors.videoUrl)}
                helperText={
                  galleryErrors.videoUrl ||
                  'Optional. Paste a YouTube link to feature alongside the images.'
                }
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                required
                value={editingGallery.description}
                onChange={handleGalleryInputChange('description')}
                placeholder="Short description"
                error={Boolean(galleryErrors.description)}
                helperText={galleryErrors.description}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeGalleryDialog} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveGalleryImage}
            disabled={isSaving || galleryPhotoUploading}
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
          setAnnouncementErrors({});
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAnnouncement?.id ? 'Edit Announcement' : 'Add Announcement'}
        </DialogTitle>

        <DialogContent>
          {editingAnnouncement && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {/* Title */}
              <TextField
                fullWidth
                label="Title"
                required
                value={editingAnnouncement.title}
                onChange={handleAnnouncementInputChange('title')}
                placeholder="Announcement title"
                error={Boolean(announcementErrors.title)}
                helperText={announcementErrors.title}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                required
                value={editingAnnouncement.description}
                onChange={handleAnnouncementInputChange('description')}
                placeholder="Announcement details"
                error={Boolean(announcementErrors.description)}
                helperText={announcementErrors.description}
              />

              {/* Date + Category */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={editingAnnouncement.date}
                  onChange={(e) =>
                    setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel id="announcement-category-label">Category</InputLabel>
                  <Select
                    labelId="announcement-category-label"
                    label="Category"
                    value={editingAnnouncement.category || ''}
                    onChange={(event: SelectChangeEvent<string>) => {
                      const value = event.target.value;
                      const normalizedSelection = normalizeAnnouncementCategoryList(value);
                      const primaryCategory = normalizedSelection[0] || '';
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        category: primaryCategory,
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {ANNOUNCEMENT_CATEGORY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Priority */}
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

              {/* Type */}
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

              <Divider sx={{ my: 1 }} />

              {/* Audience */}
              <FormControl fullWidth>
                <InputLabel id="announcement-audience-label">Audience</InputLabel>
                <Select
                  labelId="announcement-audience-label"
                  label="Audience"
                  value={editingAnnouncement.audience || ''}
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      audience: e.target.value as string,
                    })
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="students">Students</MenuItem>
                  <MenuItem value="teachers">Teachers</MenuItem>
                  <MenuItem value="parents">Parents</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>

              {/* Pinned/Urgent toggles and author */}
              <Box sx={{ display: 'flex', gap: 3, mt: 1, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!editingAnnouncement.isPinned}
                      onChange={(e) =>
                        setEditingAnnouncement({
                          ...editingAnnouncement,
                          isPinned: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Pin to Top"
                />

                <FormControlLabel
                  control={
                    <Switch
                      color="error"
                      checked={!!editingAnnouncement.isUrgent}
                      onChange={(e) =>
                        setEditingAnnouncement({
                          ...editingAnnouncement,
                          isUrgent: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Mark as Urgent"
                />

                <TextField
                  sx={{ flex: 1, minWidth: 220 }}
                  label="Author"
                  value={editingAnnouncement.author || ''}
                  onChange={(e) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      author: e.target.value,
                    })
                  }
                  placeholder="Name of the person posting this announcement"
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setAnnouncementDialog(false);
              setEditingAnnouncement(null);
              setAnnouncementErrors({});
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
