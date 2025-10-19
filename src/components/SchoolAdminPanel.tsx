import { useState, useEffect, useCallback, ReactElement } from 'react';
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
  Checkbox,
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
  CircularProgress
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
  Public,
  Star,
  TrendingUp,
  WorkspacePremium
} from '@mui/icons-material';
import {
  ANNOUNCEMENT_CATEGORY_OPTIONS,
  formatAnnouncementCategoryLabel,
  normalizeAnnouncementCategoryList,
} from '../config/announcementCategories';

type PageType = 'home' | 'achievements' | 'staff' | 'alumni' | 'gallery' | 'announcements' | 'contact';

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

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  level: string;
  sectionKey?: string;
  sectionTitle?: string;
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
  company: string;
  currentPosition: string;
  graduationYear: string;
  imageUrl: string;
  industry: string;
  location: string;
  linkedinUrl: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  categories: string[];
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
  const [achievementSectionsMeta, setAchievementSectionsMeta] =
    useState<Record<string, { title: string }>>(defaultAchievementSections);
  const [editingField, setEditingField] = useState<{ section: 'home' | 'contact'; key: string } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [expandedHomeSection, setExpandedHomeSection] = useState<string>('overview');
  const tableHeaderSx = { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: 'text.secondary' };

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
    yearEstablished: 'yearEstablished',
    students: 'students',
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
      yearEstablished: 'Add the founding year',
      students: 'Add total enrolled students',
      successRate: 'Add success rate percentage',
    },
  };

  const inlineHelperText: Record<'contact' | 'home', Record<string, string>> = {
    contact: {
      address: "Enter the school's mailing address.",
      phone: 'Include country or area code. Separate numbers with commas.',
      email: 'Provide a valid contact email address.',
      hours: 'Enter one schedule per line.',
      whatsapp: 'Include country or area code. Separate numbers with commas.',
      facebook: 'Paste the full Facebook page URL.',
      instagram: 'Paste the full Instagram profile URL.',
    },
    home: {
      title: 'Shown as the main heading on the home page.',
      subtitle: 'Displayed beneath the welcome title.',
      principalName: 'Shown in the principal highlight section.',
      principalMessage: 'Share a short greeting from the principal (max 500 characters).',
      yearEstablished: 'Use a four-digit year (e.g., 1998).',
      students: 'Example: 1500 or 2500+.',
      successRate: 'Enter a percentage between 0 and 100.',
    },
  };

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
          sx={{ fontWeight: 600 }}
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
              color: 'inherit !important',
              fontSize: 18,
            }}
          />
        }
        sx={{
          fontWeight: 600,
          backgroundColor: style.color,
          color: '#fff',
          '& .MuiChip-icon': {
            color: 'inherit !important',
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
      const truncated = value.length > 240 ? `${value.slice(0, 240)}…` : value;
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
    if (section === 'contact') {
      if (!value) return null;
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
        if (!value) return null;
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
        return urlRegex.test(value) ? null : 'Enter a valid URL (include https:// if possible).';
      }
      return null;
    }

    // Home section validation
    switch (key) {
      case 'title':
        return value ? null : 'Welcome title is required.';
      case 'principalName':
        return value ? null : 'Principal name is required.';
      case 'principalMessage':
        return value.length > 500 ? 'Maximum 500 characters allowed.' : null;
      case 'yearEstablished':
        if (!value) return null;
        if (!/^\d{4}$/.test(value)) return 'Use a four-digit year (>= 1800).';
        const year = Number(value);
        const currentYear = new Date().getFullYear();
        if (year < 1800 || year > currentYear) return 'Enter a valid year.';
        return null;
      case 'students':
        if (!value) return null;
        return /^[\d+\s,]+$/.test(value) ? null : 'Use digits or "+" only.';
      case 'successRate': {
        if (!value) return null;
        const cleaned = value.replace('%', '').trim();
        const numeric = Number(cleaned);
        if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
          return 'Enter a value between 0 and 100.';
        }
        return null;
      }
      case 'subtitle':
        return null;
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
    welcomeTitle: home?.welcomeTitle || '',
    welcomeSubTitle: home?.welcomeSubTitle || '',
    principalName: home?.principalName || '',
    principalMessage: home?.principalMessage || '',
    yearEstablished: home?.yearEstablished || '',
    students: home?.students || '',
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

  const renderSummaryGrid = (
    section: 'home' | 'contact',
    items: Array<{ key: string; title: string; icon: ReactElement; lines: string[] }>
  ) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))',
        },
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

    setHomeData({
      welcomeTitle: homePage.welcomeTitle || schoolData.welcomeTitle || '',
      welcomeSubTitle: homePage.welcomeSubtitle || schoolData.welcomeSubtitle || '',
      principalName: principalSection.name || homePage.principalName || '',
      principalMessage: principalSection.message || homePage.principalMessage || '',
      yearEstablished: statisticsSection.yearEstablished || schoolData.yearEstablished || '',
      students: statisticsSection.studentsCount || schoolData.studentsCount || '',
      successRate: statisticsSection.successRate || schoolData.successRate || '',
    });

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
        imageUrl: staff.imageUrl || staff.image || '',
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
        imageUrl: String(alumni.imageUrl || alumni.image || '').trim(),
        industry: String(alumni.industry || '').trim() || 'Other',
        location: String(alumni.location || '').trim(),
        linkedinUrl: String(alumni.linkedinUrl || alumni.linkedIn || '').trim(),
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
      const categories = normalizeAnnouncementCategoryList([announcement.categories, announcement.category]);
      const primaryCategory = categories[0] || '';
      return {
        id: announcement.id || `announcement-${index + 1}`,
        title: announcement.title || '',
        description: announcement.description || '',
        date: announcement.date || '',
        category: primaryCategory,
        categories,
        priority: (announcement.priority || 'medium').toLowerCase(),
        type: (announcement.type || 'announcement').toLowerCase(),
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
    setEditingAchievement({
      id: '',
      title: '',
      description: '',
      date: '',
      level: 'national',
      sectionKey: 'general',
      sectionTitle: getAchievementSectionLabel('general'),
    });
    setAchievementDialog(true);
  };

  const openEditAchievement = (achievement: Achievement) => {
    setEditingAchievement({ ...achievement });
    setAchievementDialog(true);
  };

  const saveAchievement = async () => {
    if (!editingAchievement) return;
    const sectionKey = editingAchievement.sectionKey || 'general';
    const normalizedSectionKey = normalizeAchievementSectionKey(sectionKey);
    const normalizedLevel = (editingAchievement.level || 'others').toString().toLowerCase();
    const sectionTitle = getAchievementSectionLabel(normalizedSectionKey);
    const achievementEntry: Achievement = {
      ...editingAchievement,
      sectionKey: normalizedSectionKey,
      level: normalizedLevel,
      sectionTitle,
    };
    const updatedList = editingAchievement.id
      ? achievements.map((a: Achievement) => (a.id === editingAchievement.id ? achievementEntry : a))
      : [...achievements, { ...achievementEntry, id: Date.now().toString() }];
    const targetSchoolId = schoolId || 'educonnect';
    try {
      setIsSaving(true);
      const payload = buildAchievementsPayload(updatedList);
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
      company: '',
      currentPosition: '',
      graduationYear: '',
      imageUrl: '',
      industry: 'Other',
      location: '',
      linkedinUrl: '',
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
      id: editingAlumni.id || `alumni-${Date.now()}`,
      name: (editingAlumni.name || '').trim(),
      company: (editingAlumni.company || '').trim(),
      currentPosition: (editingAlumni.currentPosition || '').trim(),
      graduationYear: (editingAlumni.graduationYear || '').trim(),
      imageUrl: (editingAlumni.imageUrl || '').trim(),
      industry: (editingAlumni.industry || '').trim() || 'Other',
      location: (editingAlumni.location || '').trim(),
      linkedinUrl: (editingAlumni.linkedinUrl || '').trim(),
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
      categories: [],
      priority: 'medium',
      type: 'announcement',
    });
    setAnnouncementDialog(true);
  };

  const openEditAnnouncement = (announcement: Announcement) => {
    const categories = normalizeAnnouncementCategoryList([announcement.categories, announcement.category]);

    setEditingAnnouncement({
      ...announcement,
      category: categories[0] || '',
      categories,
      priority: (announcement.priority || 'medium').toLowerCase(),
      type: (announcement.type || 'announcement').toLowerCase(),
    });
    setAnnouncementDialog(true);
  };

  const saveAnnouncement = async () => {
    if (!editingAnnouncement) return;
    const categories = normalizeAnnouncementCategoryList(
      editingAnnouncement.categories && editingAnnouncement.categories.length
        ? editingAnnouncement.categories
        : editingAnnouncement.category
    );
    const announcementEntry: Announcement = {
      ...editingAnnouncement,
      id: editingAnnouncement.id || `announcement-${Date.now()}`,
      category: categories[0] || '',
      categories,
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
            {activePage === 'home' && homeData && (() => {
              const homeOverviewItems = [
                { key: 'title', title: 'Welcome Title', icon: <Home fontSize='small' />, lines: getHomeDisplayLines('title') },
                { key: 'subtitle', title: 'Welcome Subtitle', icon: <Megaphone fontSize='small' />, lines: getHomeDisplayLines('subtitle') },
                { key: 'principalName', title: 'Principal Name', icon: <School fontSize='small' />, lines: getHomeDisplayLines('principalName') },
                { key: 'principalMessage', title: "Principal's Message", icon: <Mail fontSize='small' />, lines: getHomeDisplayLines('principalMessage') },
              ];

              const homeMetricsItems = [
                { key: 'students', title: 'Students', icon: <Users fontSize='small' />, lines: getHomeDisplayLines('students') },
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
                      {renderSummaryGrid('home', homeMetricsItems)}
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
                        <TableCell sx={tableHeaderSx}>Date</TableCell>
                        <TableCell sx={tableHeaderSx}>Description</TableCell>
                        <TableCell sx={tableHeaderSx}>Priority</TableCell>
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
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {(announcement.categories?.length
                                ? announcement.categories
                                : announcement.category
                                ? [announcement.category]
                                : []
                              ).map((category) => (
                                <Chip
                                  key={category}
                                  sx={{ fontWeight: 600 }}
                                  label={formatAnnouncementCategoryLabel(category)}
                                  size="small"
                                />
                              ))}
                              {!announcement.categories?.length && !announcement.category && (
                                <Chip sx={{ fontWeight: 600 }} label="Uncategorized" size="small" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{announcement.date}</TableCell>
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
                                {announcement.description || '—'}
                              </Typography>
                            </Box>
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
                <FormControl fullWidth>
                  <InputLabel id="announcement-category-label">Categories</InputLabel>
                  <Select
                    labelId="announcement-category-label"
                    multiple
                    label="Categories"
                    value={editingAnnouncement.categories || []}
                    onChange={(event: SelectChangeEvent<string[]>) => {
                      const value = event.target.value;
                      const rawSelection = typeof value === 'string' ? value.split(',') : value;
                      const normalizedSelection = normalizeAnnouncementCategoryList(rawSelection);
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        categories: normalizedSelection,
                        category: normalizedSelection[0] || '',
                      });
                    }}
                    renderValue={(selected) =>
                      (selected as string[])
                        .map((category) => formatAnnouncementCategoryLabel(category))
                        .join(', ')
                    }
                  >
                    {ANNOUNCEMENT_CATEGORY_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Checkbox
                          checked={(editingAnnouncement.categories || []).includes(option.value)}
                        />
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

