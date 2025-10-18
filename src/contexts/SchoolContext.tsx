import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { SchoolData, fetchSchoolData } from '../config/firebase';

interface SchoolContextType {
  schoolData: SchoolData | null;
  loading: boolean;
  error: string | null;
  refreshSchoolData: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

interface SchoolProviderProps {
  children: ReactNode;
}

export function SchoolProvider({ children }: SchoolProviderProps) {
  const { schoolId = 'riverside-academy' } = useParams<{ schoolId: string }>(); // Default school slug
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchoolData = async (identifier: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSchoolData(identifier);
      
      if (!data) {
        setError(`School not found: ${identifier}`);
        setSchoolData(null);
      } else {
        setSchoolData(data);
      }
    } catch (err) {
      console.error('Error loading school data:', err);
      setError('Failed to load school data');
      setSchoolData(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSchoolData = async () => {
    if (schoolId) {
      await loadSchoolData(schoolId);
    }
  };

  useEffect(() => {
    if (schoolId) {
      loadSchoolData(schoolId);
    }
  }, [schoolId]);

  const value: SchoolContextType = {
    schoolData,
    loading,
    error,
    refreshSchoolData,
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool(): SchoolContextType {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}