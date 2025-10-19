// Firebase initialization and helper functions
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { sampleSchoolData } from '../data/schoolData';

// Interface for timeline milestone
export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

// Interface for announcements
export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'event' | 'announcement' | 'news';
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

//Interface for Contact us page
export interface ContactUsInfo {
  address: string;
  phone: string | string[]; // Can be string or array
  email: string | string[]; // Can be string or array
  officeHours: string | string[]; // Can be string or array
  latitude: number;
  longitude: number;
  socialMedia?: Record<string, string> | string;
  whatsApp?: string | string[]; // Make WhatsApp optional
  facebook?: string;
  instagram?: string;
}

// Interface for staff member
export interface StaffMember {
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
  schoolId: string;
}

// Interface for department
export interface Department {
  id: string;
  label: string;
  schoolId: string;
  order?: number;
}

// Interface for alumni member
export interface AlumniMember {
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
  schoolId: string;
}

// Interface for alumni stats
export interface AlumniStat {
  label: string;
  value: string;
  color: string;
}

// Interface for alumni decades
export interface AlumniDecade {
  id: string;
  label: string;
}

// Interface for alumni industries
export interface AlumniIndustry {
  id: string;
  label: string;
  icon: string;
}

// Interface for alumni page data
export interface AlumniPageData {
  stats: AlumniStat[];
  decades: AlumniDecade[];
  industries: AlumniIndustry[];
  alumniMembers: AlumniMember[];
}

// Interface for school data
export interface SchoolData {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  domain?: string; // Optional custom domain
  welcomeTitle: string;
  welcomeSubtitle: string;
  studentsCount: string;
  teachersCount: string;
  awardsCount: string;
  yearEstablished: string;
  successRate: string;
  whyChooseTitle?: string;
  whyChooseSubtitle?: string;
  heroImages: string[];
  timeline: TimelineMilestone[];
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  pages?: any; // Complete hierarchical page data
}

// Interface for page content
export interface PageContent {
  id: string;
  schoolId: string;
  pageType: 'about' | 'achievements' | 'staff' | 'alumni' | 'gallery' | 'announcements' | 'contact';
  title: string;
  content: any; // Flexible content structure
  lastUpdated: Date;
}

// Public Firebase config (client-side safe)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY ,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize (guard against re-init in hot reload)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Fetch school data by slug or ID from new collection structure with fallback to local data
export async function fetchSchoolData(identifier: string): Promise<SchoolData | null> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    try {
      // Try to access the school's collection directly
      const schoolCollectionRef = collection(db, collectionId);
      const schoolCollectionSnapshot = await getDocs(schoolCollectionRef);
      
      if (!schoolCollectionSnapshot.empty) {
        // Find required documents
        const schoolInfoDoc = schoolCollectionSnapshot.docs.find(doc => doc.id === 'schoolInfo');
        const homePageDoc = schoolCollectionSnapshot.docs.find(doc => doc.id === 'homePage');
        
        if (schoolInfoDoc) {
          const schoolInfo = schoolInfoDoc.data();
          const homePage = homePageDoc?.data();
          
          // Verify this matches our identifier
          if (schoolInfo.slug === identifier || schoolInfo.id === identifier || collectionId === identifier) {
            
            // Collect all page data
            const pages: any = {};
            schoolCollectionSnapshot.docs.forEach(doc => {
              pages[doc.id] = doc.data();
            });
            
            return {
              id: schoolInfo.id || collectionId,
              name: schoolInfo.name || '',
              slug: schoolInfo.slug || identifier,
              domain: schoolInfo.domain,
              welcomeTitle: homePage?.heroSection?.welcomeTitle || '',
              welcomeSubtitle: homePage?.heroSection?.welcomeSubtitle || '',
              studentsCount: homePage?.statisticsSection?.studentsCount || '0',
              teachersCount: homePage?.statisticsSection?.teachersCount || '0',
              awardsCount: homePage?.statisticsSection?.awardsCount || '0',
              yearEstablished: homePage?.statisticsSection?.yearEstablished || '',
              successRate: homePage?.statisticsSection?.successRate || '',
              whyChooseTitle: homePage?.whyChooseSection?.whyChooseTitle,
              whyChooseSubtitle: homePage?.whyChooseSection?.whyChooseSubtitle,
              heroImages: homePage?.heroSection?.heroImages || [],
              timeline: homePage?.timelineSection || [],
              logo: schoolInfo.logo,
              primaryColor: schoolInfo.primaryColor,
              secondaryColor: schoolInfo.secondaryColor,
              contactInfo: pages.contactPage || {},
              socialMedia: pages.contactPage?.socialMedia || {},
              pages: pages
            };
          }
        }
      }
    } catch (newFormatError) {
      console.log(`School collection ${collectionId} not found, trying local data`);
    }
    
    // Fallback to local data
    console.log('No school found in Firebase, trying local data for identifier:', identifier);
    
    const localSchoolData = (sampleSchoolData as any)[identifier];
    if (localSchoolData) {
      console.log('Using local data for school:', identifier);
      
      const schoolInfo = localSchoolData.schoolInfo;
      const homePage = localSchoolData.homePage;
      
      return {
        id: schoolInfo.id,
        name: schoolInfo.name,
        slug: schoolInfo.slug,
        domain: schoolInfo.domain,
        welcomeTitle: homePage.heroSection.welcomeTitle,
        welcomeSubtitle: homePage.heroSection.welcomeSubtitle,
        studentsCount: homePage.statisticsSection.studentsCount,
        teachersCount: homePage.statisticsSection.teachersCount,
        awardsCount: homePage.statisticsSection.awardsCount,
        yearEstablished: homePage.statisticsSection.yearEstablished || '',
        successRate: homePage.statisticsSection.successRate || '',
        whyChooseTitle: homePage.whyChooseSection?.whyChooseTitle,
        whyChooseSubtitle: homePage.whyChooseSection?.whyChooseSubtitle,
        heroImages: homePage.heroSection.heroImages,
        timeline: homePage.timelineSection || [],
        logo: schoolInfo.logo,
        primaryColor: schoolInfo.primaryColor,
        secondaryColor: schoolInfo.secondaryColor,
        pages: localSchoolData
      };
    }
    
    console.log('No school found with identifier:', identifier);
    return null;
    
  } catch (err) {
    console.error('Failed to fetch school data from Firestore', err);
    return null;
  }
}

// Fetch page content for a specific school and page from new collection structure
export async function fetchPageContent(schoolId: string, pageType: string): Promise<PageContent | null> {
  try {
    // Convert schoolId to collection ID format
    const collectionId = schoolId.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    try {
      // Try to access the school's collection directly
      const schoolCollectionRef = collection(db, collectionId);
      const schoolCollectionSnapshot = await getDocs(schoolCollectionRef);
      
      if (!schoolCollectionSnapshot.empty) {
        const schoolInfoDoc = schoolCollectionSnapshot.docs.find(doc => doc.id === 'schoolInfo');
        const pageDoc = schoolCollectionSnapshot.docs.find(doc => doc.id === `${pageType}Page`);
        
        if (pageDoc && schoolInfoDoc) {
          const pageData = pageDoc.data();
          const schoolInfo = schoolInfoDoc.data();
          
          return {
            id: `${schoolId}-${pageType}`,
            schoolId: schoolInfo.id || schoolId,
            pageType: pageType as any,
            title: `${schoolInfo.name || 'School'} - ${pageType.charAt(0).toUpperCase() + pageType.slice(1)}`,
            content: pageData,
            lastUpdated: pageData.lastUpdated?.toDate() || new Date(),
          };
        }
      }
    } catch (error) {
      console.log(`Page ${pageType} not found in collection ${collectionId}`);
    }
    
    return null;
  } catch (err) {
    console.error(`Failed to fetch page content for ${pageType}:`, err);
    return null;
  }
}

// Legacy functions for backward compatibility
export async function fetchHomePageData(): Promise<Map<string, string> | null> {
  console.warn('fetchHomePageData is deprecated. Use fetchSchoolData instead.');
  const schoolData = await fetchSchoolData('VAqXAlAGZy49dJATbLSd'); // Default school ID
  if (!schoolData) return null;
  
  const homePageMap = new Map<string, string>();
  homePageMap.set('welcomeTitle', schoolData.welcomeTitle);
  homePageMap.set('welcomeSubtitle', schoolData.welcomeSubtitle);
  homePageMap.set('studentsCount', schoolData.studentsCount);
  homePageMap.set('teachersCount', schoolData.teachersCount);
  homePageMap.set('awardsCount', schoolData.awardsCount);
  homePageMap.set('yearEstablished', schoolData.yearEstablished);
  homePageMap.set('successRate', schoolData.successRate);
  
  return homePageMap;
}

export async function fetchHeroImages(): Promise<string[]> {
  console.warn('fetchHeroImages is deprecated. Use fetchSchoolData instead.');
  const schoolData = await fetchSchoolData('VAqXAlAGZy49dJATbLSd'); // Default school ID
  return schoolData?.heroImages || [];
}

export async function fetchTimelineMilestones(): Promise<TimelineMilestone[]> {
  console.warn('fetchTimelineMilestones is deprecated. Use fetchSchoolData instead.');
  const schoolData = await fetchSchoolData('VAqXAlAGZy49dJATbLSd'); // Default school ID
  return schoolData?.timeline || [];
}

// Fetch contact page data for a specific school with fallback to local data
export async function fetchContactPageData(schoolId: string): Promise<ContactUsInfo | null> {
  try {
    const pageContent = await fetchPageContent(schoolId, 'contact');
    if (pageContent && pageContent.content) {
      const contactData = pageContent.content;
      return {
        address: contactData.address || '',
        phone: contactData.phone || [],
        email: contactData.email || [],
        whatsApp: contactData.whatsApp || [],
        officeHours: contactData.officeHours || [],
        latitude: contactData.latitude,
        longitude: contactData.longitude,
        socialMedia: contactData.socialMedia,
        facebook:
          contactData.facebook ||
          (contactData.socialMedia && contactData.socialMedia.facebook) ||
          '',
        instagram:
          contactData.instagram ||
          (contactData.socialMedia && contactData.socialMedia.instagram) ||
          ''
      };
    }

    // Fallback to local data
    console.log('No contact page data found in Firebase, trying local data for school:', schoolId);
    const localSchoolData = (sampleSchoolData as any)[schoolId];
    if (localSchoolData && localSchoolData.contactPage) {
      const contactData = localSchoolData.contactPage;
      return {
        address: contactData.address || '',
        phone: contactData.phone || [],
        email: contactData.email || [],
        whatsApp: contactData.whatsApp || [],
        officeHours: contactData.officeHours || [],
        latitude: contactData.latitude,
        longitude: contactData.longitude,
        socialMedia: contactData.socialMedia,
        facebook:
          contactData.facebook ||
          (contactData.socialMedia && contactData.socialMedia.facebook) ||
          '',
        instagram:
          contactData.instagram ||
          (contactData.socialMedia && contactData.socialMedia.instagram) ||
          ''
      };
    }

    console.log(`No contact page data found for school ${schoolId}`);
    return null;
  } catch (err) {
    console.error(`Failed to fetch contact page data for school ${schoolId}:`, err);
    return null;
  }
}

export interface AdminJourneyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface AdminHomePagePayload {
  welcomeTitle: string;
  welcomeSubTitle: string;
  principalName: string;
  principalMessage: string;
  yearEstablished: string;
  students: string;
  successRate: string;
  journeyMilestones: AdminJourneyMilestone[];
}

export interface AdminContactPagePayload {
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  whatsApp?: string;
  facebook?: string;
  instagram?: string;
}

export async function updateHomePageContent(identifier: string, payload: AdminHomePagePayload): Promise<void> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    // Update homePage document directly
    const homePageDocRef = doc(db, collectionId, 'homePage');
    
    const homePageUpdates = {
      welcomeTitle: payload.welcomeTitle,
      welcomeSubtitle: payload.welcomeSubTitle,
      principalSection: {
        name: payload.principalName,
        message: payload.principalMessage
      },
      statisticsSection: {
        yearEstablished: payload.yearEstablished,
        studentsCount: payload.students,
        successRate: payload.successRate
      },
      timelineSection: {
        milestones: (payload.journeyMilestones || []).map((milestone) => ({
          id: milestone.id,
          year: milestone.year,
          title: milestone.title,
          description: milestone.description,
        }))
      },
    };

    await setDoc(homePageDocRef, homePageUpdates, { merge: true });
    
    // Also update school info document with basic stats
    const schoolInfoDocRef = doc(db, collectionId, 'schoolInfo');
    const schoolInfoUpdates = {
      yearEstablished: payload.yearEstablished,
      studentsCount: payload.students,
      successRate: payload.successRate
    };
    
    await setDoc(schoolInfoDocRef, schoolInfoUpdates, { merge: true });
  } catch (err) {
    console.error(`Failed to update home page for school ${identifier}:`, err);
    throw err;
  }
}

export async function updateContactPageContent(identifier: string, payload: AdminContactPagePayload): Promise<void> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    const parseList = (value: string, separator: RegExp | string) => {
      if (!value || !value.trim()) {
        return [];
      }
      return value
        .split(separator as any)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    const phoneArray = parseList(payload.phone, ',');
    const emailArray = parseList(payload.email, ',');
    const officeHoursArray = parseList(payload.officeHours, /\r?\n/);
    const whatsAppArray = parseList(payload.whatsApp ?? '', ',');
    const facebookValue = (payload.facebook ?? '').trim();
    const instagramValue = (payload.instagram ?? '').trim();

    // Update contactPage document directly
    const contactPageDocRef = doc(db, collectionId, 'contactPage');
    
    const contactPageUpdates = {
      address: payload.address,
      phone: phoneArray,
      email: emailArray,
      officeHours: officeHoursArray,
      whatsApp: whatsAppArray,
      socialMedia: {
        facebook: facebookValue,
        instagram: instagramValue
      }
    };

    await setDoc(contactPageDocRef, contactPageUpdates, { merge: true });
    
    // Also update school info document with contact info
    const schoolInfoDocRef = doc(db, collectionId, 'schoolInfo');
    const schoolInfoUpdates = {
      contactInfo: {
        address: payload.address,
        phone: phoneArray,
        email: emailArray,
        officeHours: officeHoursArray,
        whatsApp: whatsAppArray,
        socialMedia: {
          facebook: facebookValue,
          instagram: instagramValue
        }
      }
    };
    
    await setDoc(schoolInfoDocRef, schoolInfoUpdates, { merge: true });
  } catch (err) {
    console.error(`Failed to update contact page for school ${identifier}:`, err);
    throw err;
  }
}

export async function updateAchievementsPageContent(
  identifier: string,
  sections: Record<string, { title: string; achievements: any[] }>
): Promise<void> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');

    const normalizedSections: Record<string, any> = {};

    Object.entries(sections).forEach(([key, sectionValue]) => {
      normalizedSections[key] = {
        title: sectionValue.title,
        achievements: (sectionValue.achievements || []).map((item: any, index: number) => ({
          id: item.id || `${key}-${index + 1}`,
          title: item.title || '',
          description: item.description || '',
          level: item.level || '',
          year: item.year || item.date || '',
          date: item.date || '',
        })),
      };
    });

    // Update achievementsPage document directly
    const achievementsPageDocRef = doc(db, collectionId, 'achievementsPage');
    
    await setDoc(achievementsPageDocRef, normalizedSections, { merge: true });
  } catch (err) {
    console.error(`Failed to update achievements page for school ${identifier}:`, err);
    throw err;
  }
}

export async function updateStaffPageContent(identifier: string, staffMembers: any[]): Promise<void> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');

    const parseCSV = (value: string) =>
      value
        ? value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : [];

    const normalizedStaff = (staffMembers || []).map((staff: any, index: number) => ({
      id: staff.id || `staff-${index + 1}`,
      name: staff.name || '',
      department: staff.department || 'other',
      position: staff.position || '',
      experience: staff.experience || '',
      email: staff.email || '',
      phone: staff.phone || '',
      education: staff.education || '',
      specializations: Array.isArray(staff.specializations)
        ? staff.specializations
        : parseCSV(staff.specializations || ''),
      image: staff.imageUrl || staff.image || '',
      schoolId: staff.schoolId || identifier,
    }));

    // Update staffPage document directly
    const staffPageDocRef = doc(db, collectionId, 'staffPage');
    
    const staffPayload = normalizedStaff.reduce((acc, staff, index) => {
      acc[index.toString()] = staff;
      return acc;
    }, {} as Record<string, any>);

    await setDoc(staffPageDocRef, staffPayload);
  } catch (err) {
    console.error(`Failed to update staff page for school ${identifier}:`, err);
    throw err;
  }
}

export async function updateAlumniPageContent(identifier: string, alumniMembers: any[]): Promise<void> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');

    const parseCSV = (value: string) =>
      value
        ? value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        : [];

    const normalizedAlumni = (alumniMembers || []).map((alumni: any, index: number) => ({
      id: alumni.id || `alumni-${index + 1}`,
      name: alumni.name || '',
      bio: alumni.bio || '',
      company: alumni.company || '',
      currentPosition: alumni.currentPosition || '',
      graduationYear: alumni.graduationYear || '',
      image: alumni.imageUrl || alumni.image || '',
      industry: alumni.industry || '',
      location: alumni.location || '',
      linkedIn: alumni.linkedinUrl || alumni.linkedIn || '',
      achievements: Array.isArray(alumni.achievements)
        ? alumni.achievements
        : parseCSV(alumni.achievements || ''),
    }));

    // Update alumniPage document directly
    const alumniPageDocRef = doc(db, collectionId, 'alumniPage');
    
    const alumniPageUpdates = {
      alumni: normalizedAlumni
    };

    await setDoc(alumniPageDocRef, alumniPageUpdates, { merge: true });
  } catch (err) {
    console.error(`Failed to update alumni page for school ${identifier}:`, err);
    throw err;
  }
}

export async function updateGalleryPageContent(identifier: string, galleryItems: any[]): Promise<void> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');

    const normalizedGallery = (galleryItems || []).map((item: any, index: number) => ({
      id: item.id || `gallery-${index + 1}`,
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      date: item.date || '',
      imageUrl: item.imageUrl || item.image || '',
    }));

    // Update galleryPage document directly
    const galleryPageDocRef = doc(db, collectionId, 'galleryPage');
    
    const galleryPageUpdates = {
      galleryImages: normalizedGallery
    };

    await setDoc(galleryPageDocRef, galleryPageUpdates, { merge: true });
  } catch (err) {
    console.error(`Failed to update gallery page for school ${identifier}:`, err);
    throw err;
  }
}

export async function updateAnnouncementsPageContent(identifier: string, announcements: any[]): Promise<void> {
  try {
    // Convert identifier to collection ID format
    const collectionId = identifier.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');

    const normalizedAnnouncements = (announcements || []).map((announcement: any, index: number) => {
      const priority = (announcement.priority || 'medium').toLowerCase();
      const type = (announcement.type || 'announcement').toLowerCase();

      return {
        id: announcement.id || `announcement-${index + 1}`,
        title: announcement.title || '',
        description: announcement.description || '',
        date: announcement.date || '',
        category: announcement.category || '',
        priority,
        type,
      };
    });

    // Update announcementsPage document directly
    const announcementsPageDocRef = doc(db, collectionId, 'announcementsPage');
    
    const announcementsPageUpdates = {
      announcements: normalizedAnnouncements
    };

    await setDoc(announcementsPageDocRef, announcementsPageUpdates, { merge: true });
    
    // Also update homePage with recent announcements
    const homePageDocRef = doc(db, collectionId, 'homePage');
    const homePageUpdates = {
      announcementsSection: {
        recentUpdates: normalizedAnnouncements.slice(0, 3)
      }
    };
    
    await setDoc(homePageDocRef, homePageUpdates, { merge: true });
  } catch (err) {
    console.error(`Failed to update announcements for school ${identifier}:`, err);
    throw err;
  }
}

// Fetch staff members for a specific school from new collection structure
const staffDocToArray = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return Object.values(data).filter(
    (item) =>
      item &&
      typeof item === 'object' &&
      ('name' in item || 'department' in item || 'position' in item)
  );
};

export async function fetchStaffData(schoolId: string): Promise<StaffMember[]> {
  try {
    // Convert schoolId to collection ID format
    const collectionId = schoolId.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    try {
      // Try to access the school's collection directly
      const schoolCollectionRef = collection(db, collectionId);
      const schoolCollectionSnapshot = await getDocs(schoolCollectionRef);
      
      if (!schoolCollectionSnapshot.empty) {
        const staffDoc = schoolCollectionSnapshot.docs.find(doc => doc.id === 'staffPage');
        
        if (staffDoc) {
          const staffData = staffDoc.data();
          const staffArray = staffDocToArray(staffData);
          const staffMembers: StaffMember[] = [];
          
          staffArray.forEach((staff: any) => {
            staffMembers.push({
              id: staff.id || `staff-${staffMembers.length + 1}`,
              name: staff.name || '',
              position: staff.position || '',
              department: staff.department || 'other',
              email: staff.email || '',
              phone: staff.phone || '',
              education: staff.education || '',
              experience: staff.experience || '',
              specializations: staff.specializations || staff.specialties || [],
              image: staff.image || '',
              schoolId: staff.schoolId || schoolId
            });
          });
          
          return staffMembers;
        }
      }
    } catch (error) {
      console.log(`Staff data not found in collection ${collectionId}`);
    }
    
    console.log(`No staff data found for school: ${schoolId}`);
    return [];
  } catch (err) {
    console.error(`Failed to fetch staff data for school ${schoolId}:`, err);
    return [];
  }
}

// Fetch departments for a specific school from staffPage data in Schools collection
export async function fetchDepartments(schoolId: string): Promise<Department[]> {
  try {
    const schoolsRef = collection(db, 'Schools');
    const schoolsSnapshot = await getDocs(schoolsRef);
    
    let schoolData: any = null;
    
    // Find the school document
    for (const doc of schoolsSnapshot.docs) {
      const data = doc.data();
      if (data.id === schoolId || data.slug === schoolId) {
        schoolData = data;
        break;
      }
    }
    
    if (!schoolData || !schoolData.pages || !schoolData.pages.staffPage) {
      console.log(`No staff data found for school: ${schoolId}`);
      return [];
    }
    
    const staffArray = staffDocToArray(schoolData.pages.staffPage);
    if (staffArray.length === 0) {
      console.log(`No staff data found for school: ${schoolId}`);
      return [];
    }
    const departmentSet = new Set<string>();
    
    // Extract departments from staff array
    staffArray.forEach((staff: any) => {
      if (staff.department) {
        departmentSet.add(staff.department);
      } else {
        departmentSet.add('other');
      }
    });
    
    // Convert to Department objects
    const departments: Department[] = Array.from(departmentSet).map(deptId => ({
      id: deptId,
      label: formatDepartmentLabel(deptId),
      schoolId: schoolId,
      order: getDepartmentOrder(deptId)
    }));
    
    // Sort by order
    departments.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return departments;
  } catch (err) {
    console.error(`Failed to fetch departments for school ${schoolId}:`, err);
    return [];
  }
}

// Helper function to format department labels
function formatDepartmentLabel(departmentId: string): string {
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
}

// Helper function to get department order for sorting
function getDepartmentOrder(departmentId: string): number {
  const orderMap: { [key: string]: number } = {
    'administration': 1,
    'mathematics': 2,
    'science': 3,
    'english': 4,
    'social_studies': 5,
    'arts': 6,
    'music': 7,
    'languages': 8,
    'technology': 9,
    'athletics': 10,
    'counseling': 11,
    'health': 12,
    'library': 13,
    'other': 99
  };
  
  return orderMap[departmentId.toLowerCase()] || 50;
}

// Fetch alumni data for a specific school from new collection structure
export async function fetchAlumniData(schoolId: string): Promise<AlumniPageData | null> {
  try {
    // Convert schoolId to collection ID format
    const collectionId = schoolId.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    try {
      // Try to access the school's collection directly
      const schoolCollectionRef = collection(db, collectionId);
      const schoolCollectionSnapshot = await getDocs(schoolCollectionRef);
      
      if (!schoolCollectionSnapshot.empty) {
        const alumniDoc = schoolCollectionSnapshot.docs.find(doc => doc.id === 'alumniPage');
        
        if (alumniDoc) {
          const alumniPage = alumniDoc.data();
          const alumniMembers = alumniPage.alumni || [];
          
          // Generate decades dynamically from alumni members
          const graduationYears = alumniMembers.map((member: AlumniMember) => parseInt(member.graduationYear));
          const decadeNumbers = graduationYears.map((year: number) => Math.floor(year / 10) * 10);
          const uniqueDecades = Array.from(new Set(decadeNumbers)) as number[];
          uniqueDecades.sort((a: number, b: number) => b - a);
          
          const decades: AlumniDecade[] = [
            { id: "all", label: "All Years" },
            ...uniqueDecades.map(decade => ({
              id: `${decade}s`,
              label: `${decade}s`
            }))
          ];
          
          // Generate industries dynamically from alumni members
          const industriesArray = alumniMembers
            .map((member: AlumniMember) => member.industry)
            .filter((industry: string | undefined): industry is string => Boolean(industry));
          const uniqueIndustries = Array.from(new Set(industriesArray)) as string[];
          
          const industries: AlumniIndustry[] = [
            { id: "all", label: "All Industries", icon: "Business" },
            ...uniqueIndustries.map((industry: string) => ({
              id: industry.toLowerCase().replace(/\s+/g, ''),
              label: industry,
              icon: "Business"
            }))
          ];
          
          return {
            stats: alumniPage.stats || [],
            decades,
            industries,
            alumniMembers
          };
        }
      }
    } catch (error) {
      console.log(`Alumni data not found in collection ${collectionId}`);
    }
    
    console.log(`No alumni page found for school: ${schoolId}`);
    return null;
  } catch (err) {
    console.error(`Failed to fetch alumni data for school ${schoolId}:`, err);
    return null;
  }
}

// Fetch alumni members for a specific school from Schools collection alumniPage
export async function fetchAlumniMembers(schoolId: string): Promise<AlumniMember[]> {
  try {
    const alumniData = await fetchAlumniData(schoolId);
    return alumniData?.alumniMembers || [];
  } catch (err) {
    console.error(`Failed to fetch alumni members for school ${schoolId}:`, err);
    return [];
  }
}

// Fetch alumni stats for a specific school from Schools collection alumniPage
export async function fetchAlumniStats(schoolId: string): Promise<AlumniStat[]> {
  try {
    const alumniData = await fetchAlumniData(schoolId);
    return alumniData?.stats || [];
  } catch (err) {
    console.error(`Failed to fetch alumni stats for school ${schoolId}:`, err);
    return [];
  }
}

// Fetch alumni decades for a specific school from Schools collection alumniPage
export async function fetchAlumniDecades(schoolId: string): Promise<AlumniDecade[]> {
  try {
    const alumniData = await fetchAlumniData(schoolId);
    return alumniData?.decades || [];
  } catch (err) {
    console.error(`Failed to fetch alumni decades for school ${schoolId}:`, err);
    return [];
  }
}

// Fetch alumni industries for a specific school from Schools collection alumniPage
export async function fetchAlumniIndustries(schoolId: string): Promise<AlumniIndustry[]> {
  try {
    const alumniData = await fetchAlumniData(schoolId);
    return alumniData?.industries || [];
  } catch (err) {
    console.error(`Failed to fetch alumni industries for school ${schoolId}:`, err);
    return [];
  }
}


