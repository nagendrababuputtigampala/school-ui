// Firebase initialization and helper functions
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Interface for timeline milestone
export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

//Interface for Contact us page
export interface ContactUsInfo {
  address: string;
  phone: string[];
  email: string[];
  officeHours: string[];
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

// Fetch school name from a schools document
// Expects Firestore doc path: schools/{schoolId} with field schoolName OR appName
export async function fetchSchoolName(): Promise<string | null> {
  try {
    const ref = doc(db, 'schools', 'UEcTbYMLEYvssjxpBksL');
    console.log("Reference:", ref);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as { siteName?: string; appName?: string };
    return data.siteName || data.appName || null;
  } catch (err) {
    console.error('Failed to fetch site name from Firestore', err);
    return null;
  }
}

export async function fetchHomePageData(): Promise<Map<string, string> | null> {
  try {
    const ref = doc(db, 'schoolInfo', 'VAqXAlAGZy49dJATbLSd');
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    
    const data = snap.data();
    const homePageMap = new Map<string, string>();
    
    // Convert the document data to a Map
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        homePageMap.set(key, value);
      } else if (typeof value === 'number') {
        homePageMap.set(key, value.toString());
      }
    });
    
    return homePageMap;
  } catch (err) {
    console.error('Failed to fetch homepage data from Firestore', err);
    return null;
  }
}

// Fetch hero images from Firebase
export async function fetchHeroImages(): Promise<string[]> {
  try {
    const ref = doc(db, 'schoolInfo', 'VAqXAlAGZy49dJATbLSd');
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];
    
    const data = snap.data();
    // Assuming heroImages is stored as an array in Firebase
    return data.heroImages || [];
  } catch (err) {
    console.error('Failed to fetch hero images from Firestore', err);
    return [];
  }
}

// Fetch timeline milestones from Firebase
export async function fetchTimelineMilestones(): Promise<TimelineMilestone[]> {
  try {
    const ref = doc(db, 'schoolInfo', 'VAqXAlAGZy49dJATbLSd');
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];
    
    const data = snap.data();
    // Assuming timeline is stored as an array of objects in Firebase
    const timelineData = data.timeline || [];
    
    // Ensure the data matches our interface
    return timelineData.map((milestone: any) => ({
      year: milestone.year || '',
      title: milestone.title || '',
      description: milestone.description || ''
    }));
  } catch (err) {
    console.error('Failed to fetch timeline milestones from Firestore', err);
    return [];
  }
}

  //Fetch contact us information from Firebase
  export async function fetchContactUsData(): Promise<ContactUsInfo | null> {
    try {
      const ref = doc(db, "contactus", "d17tQpGkassKQKpUmdAr"); // adjust docId
      const snap = await getDoc(ref);
  
      if (!snap.exists()) return null;
      const data = snap.data();
  
      return {
        address: data.Address || "",
        phone: data.Phone ? data.Phone.split(",").map((p: string) => p.trim()) : [],
        email: data.Email ? data.Email.split(",").map((e: string) => e.trim()) : [],
        officeHours: data["Office Hours"]
          ? data["Office Hours"].split(",").map((h: string) => h.trim())
          : []
      };
    } catch (err) {
      console.error("Error fetching contact data", err);
      return null;
    }
  }
