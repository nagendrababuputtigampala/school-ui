// User management types and functions for school-level access control
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  role: 'admin' | 'super-admin';
  schoolIds: string[]; // Array of school IDs the user has access to
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // UID of the user who created this profile
}

export interface SchoolAccess {
  schoolId: string;
  schoolName: string;
  hasAccess: boolean;
}

/**
 * Creates or updates a user profile in Firestore
 */
export async function createUserProfile(
  uid: string, 
  userData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const now = new Date();
  
  const userProfile: UserProfile = {
    uid,
    ...userData,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(userRef, userProfile);
}

/**
 * Gets a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
  }
  
  return null;
}

/**
 * Updates a user profile
 */
export async function updateUserProfile(
  uid: string, 
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Checks if a user has access to a specific school
 */
export async function checkUserSchoolAccess(uid: string, schoolId: string): Promise<boolean> {
  const userProfile = await getUserProfile(uid);
  
  if (!userProfile) {
    return false;
  }
  
  // Super admins have access to all schools
  if (userProfile.role === 'super-admin') {
    return true;
  }
  
  // Check if user is active and has access to the specific school
  return userProfile.isActive && userProfile.schoolIds.includes(schoolId);
}

/**
 * Gets all schools a user has access to
 */
export async function getUserSchoolAccess(uid: string): Promise<string[]> {
  const userProfile = await getUserProfile(uid);
  
  if (!userProfile || !userProfile.isActive) {
    return [];
  }
  
  // Super admins have access to all schools
  if (userProfile.role === 'super-admin') {
    // Return all available school IDs (you might want to fetch this from a schools collection)
    return ['*']; // Special indicator for all schools
  }
  
  return userProfile.schoolIds;
}

/**
 * Adds school access to a user
 */
export async function addSchoolAccessToUser(uid: string, schoolId: string): Promise<void> {
  const userProfile = await getUserProfile(uid);
  
  if (!userProfile) {
    throw new Error('User profile not found');
  }
  
  if (!userProfile.schoolIds.includes(schoolId)) {
    const updatedSchoolIds = [...userProfile.schoolIds, schoolId];
    await updateUserProfile(uid, { schoolIds: updatedSchoolIds });
  }
}

/**
 * Removes school access from a user
 */
export async function removeSchoolAccessFromUser(uid: string, schoolId: string): Promise<void> {
  const userProfile = await getUserProfile(uid);
  
  if (!userProfile) {
    throw new Error('User profile not found');
  }
  
  const updatedSchoolIds = userProfile.schoolIds.filter(id => id !== schoolId);
  await updateUserProfile(uid, { schoolIds: updatedSchoolIds });
}

/**
 * Gets all users (for super admin management)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
  });
}

/**
 * Gets users by school ID
 */
export async function getUsersBySchool(schoolId: string): Promise<UserProfile[]> {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef, 
    where('schoolIds', 'array-contains', schoolId),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
  });
}

/**
 * Deactivates a user (soft delete)
 */
export async function deactivateUser(uid: string): Promise<void> {
  await updateUserProfile(uid, { isActive: false });
}

/**
 * Activates a user
 */
export async function activateUser(uid: string): Promise<void> {
  await updateUserProfile(uid, { isActive: true });
}

/**
 * Deletes a user profile (hard delete - use with caution)
 */
export async function deleteUserProfile(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef);
}