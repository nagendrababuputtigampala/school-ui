// Firebase initialization and helper functions
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
  socialMedia: string;
  whatsApp?: string; // Make whatsApp optional
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
  yearsCount: string;
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

// Fetch school data by slug or ID from Schools collection with fallback to local data
export async function fetchSchoolData(identifier: string): Promise<SchoolData | null> {
  try {
    // First try to find by slug in Schools collection
    const schoolsRef = collection(db, 'Schools');
    const schoolsSnapshot = await getDocs(schoolsRef);
    
    let schoolDoc = null;
    
    // Search through all school documents
    for (const doc of schoolsSnapshot.docs) {
      const data = doc.data();
      if (data.slug === identifier || data.id === identifier ) {
        schoolDoc = doc;
        break;
      }
    }
    
    // If not found in Firebase, try local data
    if (!schoolDoc) {
      console.log('No school found in Firebase, trying local data for identifier:', identifier);
      
      // Check local sample data
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
          yearsCount: homePage.statisticsSection.yearsCount,
          whyChooseTitle: homePage.whyChooseSection?.whyChooseTitle,
          whyChooseSubtitle: homePage.whyChooseSection?.whyChooseSubtitle,
          heroImages: homePage.heroSection.heroImages,
          timeline: homePage.timelineSection?.milestones || [],
          logo: schoolInfo.logo,
          primaryColor: schoolInfo.primaryColor,
          secondaryColor: schoolInfo.secondaryColor,
          pages: localSchoolData // Include full local data for page access
        };
      }
      
      console.log('No school found in Firebase or local data with identifier:', identifier);
      return null;
    }
    
    const data = schoolDoc.data();
    if (!data) return null;
    
    return {
      id: data.id || '',
      name: data.name || '',
      slug: data.slug || '',
      domain: data.domain,
      welcomeTitle: data.welcomeTitle || '',
      welcomeSubtitle: data.welcomeSubtitle || '',
      studentsCount: data.studentsCount || '0',
      teachersCount: data.teachersCount || '0',
      awardsCount: data.awardsCount || '0',
      yearsCount: data.yearsCount || '0',
      whyChooseTitle: data.whyChooseTitle,
      whyChooseSubtitle: data.whyChooseSubtitle,
      heroImages: data.heroImages || [],
      timeline: data.timeline || [],
      logo: data.logo,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      contactInfo: data.contactInfo,
      socialMedia: data.socialMedia,
      // Include full page data for advanced usage
      pages: data.pages || {}
    };
  } catch (err) {
    console.error('Failed to fetch school data from Firestore', err);
    return null;
  }
}

// Fetch page content for a specific school and page from Schools collection
export async function fetchPageContent(schoolId: string, pageType: string): Promise<PageContent | null> {
  try {
    // Get school document from Schools collection
    const schoolsRef = collection(db, 'Schools');
    const schoolsSnapshot = await getDocs(schoolsRef);
    
    let schoolData = null;
    
    // Find the school document
    for (const doc of schoolsSnapshot.docs) {
      const data = doc.data();
      if (data.id === schoolId || data.slug === schoolId) {
        schoolData = data;
        break;
      }
    }
    
    if (!schoolData || !schoolData.pages) {
      console.log(`No school found or no pages data for schoolId: ${schoolId}`);
      return null;
    }
    
    // Get the specific page data
    const pageKey = `${pageType}Page`;
    const pageData = schoolData.pages[pageKey];
    
    if (!pageData) {
      console.log(`No ${pageType} page found for school ${schoolId}`);
      return null;
    }
    
    return {
      id: `${schoolId}-${pageType}`,
      schoolId: schoolData.id,
      pageType: pageType as any,
      title: `${schoolData.name} - ${pageType.charAt(0).toUpperCase() + pageType.slice(1)}`,
      content: pageData,
      lastUpdated: schoolData.lastUpdated?.toDate() || new Date(),
    };
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
  homePageMap.set('yearsCount', schoolData.yearsCount);
  
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
        socialMedia: contactData.socialMedia
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
        socialMedia: contactData.socialMedia
      };
    }

    console.log(`No contact page data found for school ${schoolId}`);
    return null;
  } catch (err) {
    console.error(`Failed to fetch contact page data for school ${schoolId}:`, err);
    return null;
  }
}

// Fetch staff members for a specific school from Schools collection staffPage
export async function fetchStaffData(schoolId: string): Promise<StaffMember[]> {
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
    
    if (!schoolData || !schoolData.pages || !schoolData.pages.staffPage || !schoolData.pages.staffPage.staff) {
      console.log(`No staff data found for school: ${schoolId}`);
      return [];
    }
    
    const staffArray = schoolData.pages.staffPage.staff;
    const staffMembers: StaffMember[] = [];
    
    // Process each staff member from the simple array
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
        schoolId: staff.schoolId || schoolData.id
      });
    });
    
    return staffMembers;
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
    
    if (!schoolData || !schoolData.pages || !schoolData.pages.staffPage || !schoolData.pages.staffPage.staff) {
      console.log(`No staff data found for school: ${schoolId}`);
      return [];
    }
    
    const staffArray = schoolData.pages.staffPage.staff;
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


