import React, { createContext, useContext, useState, useEffect } from 'react';
import { store } from '../data/store';

interface SyncContextType {
  isLive: boolean;
  isOnline: boolean;
  lastSyncedText: string;
  isSyncing: boolean;
  justReconnected: boolean;
  toggleOnline: () => void;
  triggerSync: () => void;
  updatedEntityId: string | null;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [lastSyncedText, setLastSyncedText] = useState<string>('2 min ago');
  const [updatedEntityId, setUpdatedEntityId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setLastSyncedText('just now');
      setUpdatedEntityId(store.updatedEntityId);
    });
    return unsubscribe;
  }, []);

  const toggleOnline = () => {
    if (isOnline) {
      setIsOnline(false);
    } else {
      setIsOnline(true);
      setJustReconnected(true);
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setTimeout(() => {
          setJustReconnected(false);
        }, 3000);
      }, 1500);
    }
  };

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedText('just now');
    }, 800);
  };

  return (
    <SyncContext.Provider
      value={{
        isLive,
        isOnline,
        lastSyncedText,
        isSyncing,
        justReconnected,
        toggleOnline,
        triggerSync,
        updatedEntityId,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
