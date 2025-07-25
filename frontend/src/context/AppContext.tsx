import React, { useEffect, createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useWallet } from '@/hooks/useWallet';
import type { User, Job } from '@/types';
import { getAllJobs } from '@/services/MarketplaceServices';
import { useMarketplaceContract } from '@/hooks/useMarketplaceContract';

interface AppContextType {
  user: User | null;
  jobs: Job[];
  wallet: any;
  loadingJobs: boolean;
  loadingUser: boolean;
  setUser: (user: User | null) => void;
  setJobs: (jobs: Job[]) => void;
  refreshJobs: () => Promise<void>;
  contract: ReturnType<typeof useMarketplaceContract> | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true); // optional loading state
  const wallet = useWallet();

  const contract = useMarketplaceContract();
  
  const {user: clerkUser, isSignedIn, isLoaded} = useUser();
  // console.log(isSignedIn, clerkUser, wallet.wallet?.address);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        if (!isLoaded) {
          console.log('Clerk not loaded yet, waiting...');
          return;
        }

        if(isSignedIn && clerkUser && wallet.wallet?.address) {
          // Map Clerk user to local User type
          const mappedUser: User = {
            id: clerkUser.id,
            address: wallet?.wallet.address,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: clerkUser.firstName + ' ' + clerkUser.lastName,
            avatar: clerkUser.imageUrl || ''
          };
          setUser(mappedUser);
        }
      } catch (err) {
        console.error('Failed to restore user:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    restoreUser();
  }, [clerkUser, isSignedIn, wallet.wallet?.address]);

  const refreshJobs = async () => {
    if (!contract) {
      setLoadingJobs(false);
      return;
    }
    try {
      const jobList = await getAllJobs(contract);
      setJobs(jobList);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      await refreshJobs();
    };
    fetchJobs();
  }, [contract]);


  const value = {
    user,
    jobs,
    wallet,
    setUser,
    setJobs,
    loadingUser,
    loadingJobs,
    refreshJobs,
    contract
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};