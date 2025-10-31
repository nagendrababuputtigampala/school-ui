import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, checkUserSchoolAccess, UserProfile } from '../config/userManagement';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  checkSchoolAccess: (schoolId: string) => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
  getUserPrimarySchool: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (user: User) => {
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  const checkSchoolAccess = async (schoolId: string): Promise<boolean> => {
    if (!user) return false;
    return await checkUserSchoolAccess(user.uid, schoolId);
  };

  const getUserPrimarySchool = (): string | null => {
    if (!userProfile || !userProfile.schoolIds || userProfile.schoolIds.length === 0) {
      return null;
    }
    
    // If user has access to all schools (*), return a default school
    if (userProfile.schoolIds.includes('*')) {
      return 'educonnect'; // Default fallback school
    }
    
    // Return the first school in the list
    return userProfile.schoolIds[0];
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    logout,
    checkSchoolAccess,
    refreshUserProfile,
    getUserPrimarySchool,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};