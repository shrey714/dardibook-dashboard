import { create } from 'zustand';
import { realtimeDb } from "@/firebase/firebaseConfig";
import { ref, get as getS, set as setS, update, onValue, DatabaseReference } from "firebase/database";
import { useEffect, useMemo, useRef } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";

interface Option {
  value: string;
  label: string;
  role: string;
}

interface TokenState {
  // State
  doctorId: string | null;
  orgId: string | null;
  options: Option[];
  currentToken: number;
  loading: boolean;
  allowNotification: boolean;
  isPaused: boolean;
  
  // Internal refs (not part of state but needed for functionality)
  _isClientUpdate: boolean;
  _initialLoad: boolean;
  _debounceTimeout: number | null;
  
  // Actions
  setOptions: (options: Option[]) => void;
  setOrgId: (orgId: string | null) => void;
  initializeDoctorId: () => void;
  updateDoctorId: (id: string) => void;
  initializeTokenData: () => Promise<void>;
  updateToken: (increment: number) => void;
  togglePause: () => void;
  toggleNotification: (allow: boolean) => void;
  playNotification: () => void;
  debouncePlayNotification: () => void;
}

// Create the Zustand store
export const useTokenStore = create<TokenState>((set, get) => ({
  // State
  doctorId: null,
  orgId: null,
  options: [],
  currentToken: 0,
  loading: true,
  allowNotification: false,
  isPaused: true,
  
  // Internal refs
  _isClientUpdate: false,
  _initialLoad: true,
  _debounceTimeout: null,
  
  // Set organization ID
  setOrgId: (orgId) => {
    if (get().orgId !== orgId) {
      set({ orgId });
      
      // If we have both orgId and doctorId, initialize token data
      const { doctorId } = get();
      if (doctorId) {
        get().initializeTokenData();
      }
    }
  },
  
  // Initialize the store with options
  setOptions: (options) => {
    // Only update if options have actually changed
    const currentOptions = get().options;
    if (JSON.stringify(currentOptions) !== JSON.stringify(options)) {
      set({ options });
    }
  },
  
  // Initialize doctorId from cookie
  initializeDoctorId: () => {
    const { options } = get();
    if (typeof window !== "undefined" && options.length > 0) {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("TOKEN_ACTIVE_DOCTOR"))
        ?.split("=")[1];
      
      const foundDoctorId = options.find((option) => option.value === cookieValue)?.value ?? null;
      
      // Only update if doctorId has changed
      if (get().doctorId !== foundDoctorId) {
        set({ doctorId: foundDoctorId });
        
        // If doctorId is found and we have orgId, initialize the token data
        if (foundDoctorId && get().orgId) {
          get().initializeTokenData();
        }
      }
    }
  },
  
  // Update doctorId and save to cookie
  updateDoctorId: (id) => {
    // Only update if doctorId has changed
    if (get().doctorId !== id) {
      set({ doctorId: id });
      document.cookie = `TOKEN_ACTIVE_DOCTOR=${encodeURIComponent(id)}; path=/; Secure; SameSite=Strict;`;
      
      // Initialize token data with new doctorId if we have orgId
      if (get().orgId) {
        get().initializeTokenData();
      }
    }
  },
  
  // Initialize token data from Firebase
  initializeTokenData: async () => {
    const { doctorId, orgId } = get();
    
    if (!orgId || !doctorId) {
      set({ isPaused: true, loading: false });
      return;
    }
    
    set({ loading: true, _initialLoad: true });
    const dbRef = ref(realtimeDb, orgId + "/" + doctorId);
    
    try {
      const snapshot = await getS(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const currentTime = new Date().setHours(0, 0, 0, 0);
        const lastTime = new Date(parseInt(data.last_time, 10)).setHours(0, 0, 0, 0);
        
        if (lastTime !== currentTime) {
          // Reset token for new day
          await setS(dbRef, {
            last_time: Date.now().toString(),
            token_number: 0,
            paused: false,
          });
          set({ currentToken: 0, isPaused: false });
        } else {
          // Use existing token data
          set({ 
            currentToken: data.token_number,
            isPaused: data.paused || false
          });
        }
      } else {
        // Initialize new token data
        await setS(dbRef, {
          last_time: Date.now().toString(),
          token_number: 0,
          paused: false,
        });
        set({ currentToken: 0, isPaused: false });
      }
    } catch (error) {
      console.error("Error initializing token data:", error);
    }
    
    set({ loading: false, _initialLoad: false });
  },
  
  // Update token number
  updateToken: (increment) => {
    const { isPaused, currentToken, doctorId, orgId } = get();
    
    if (isPaused || currentToken + increment < 0 || !orgId || !doctorId) {
      return;
    }
    
    const dbRef = ref(realtimeDb, orgId + "/" + doctorId);
    const newTokenNumber = currentToken + increment;
    
    
    set({ 
      currentToken: newTokenNumber,
      _isClientUpdate: true
    });
    
    update(dbRef, {
      token_number: newTokenNumber,
      last_time: Date.now().toString(),
    });
  },
  
  // Toggle pause state
  togglePause: () => {
    const { isPaused, doctorId, orgId } = get();
    
    if (!orgId || !doctorId) {
      return;
    }
    
    const dbRef = ref(realtimeDb, orgId + "/" + doctorId);
    const newPauseState = !isPaused;
    
    set({ 
      isPaused: newPauseState,
      _isClientUpdate: true
    });
    
    update(dbRef, {
      paused: newPauseState,
    });
  },
  
  // Toggle notification
  toggleNotification: (allow) => {
    set({ allowNotification: allow });
  },
  
  // Play notification sound
  playNotification: () => {
    const audio = new Audio('/token_sound_2.mp3');
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  },
  
  // Debounce notification sound
  debouncePlayNotification: () => {
    const { _debounceTimeout } = get();
    if (_debounceTimeout !== null) {
      clearTimeout(_debounceTimeout);
    }
    
    const timeout = window.setTimeout(() => {
      if (get().allowNotification) {
        get().playNotification();
      }
    }, 500);
    
    set({ _debounceTimeout: timeout });
  }
}));

// Custom hook to manage Firebase listeners
const useFirebaseListener = (path: string | null, callback: (data: any) => void) => {
  const listenerRef = useRef<{ dbRef: DatabaseReference | null, unsubscribe: (() => void) | null }>({
    dbRef: null,
    unsubscribe: null
  });
  
  // Set up and clean up the listener
  useEffect(() => {
    // Clean up previous listener
    if (listenerRef.current.unsubscribe) {
      listenerRef.current.unsubscribe();
      listenerRef.current = { dbRef: null, unsubscribe: null };
    }
    
    // Set up new listener if path is provided
    if (path) {
      try {
        const dbRef = ref(realtimeDb, path);
        listenerRef.current.dbRef = dbRef;
        
        const unsubscribe = onValue(dbRef, 
          (snapshot) => {
            if (snapshot.exists()) {
              callback(snapshot.val());
            }
          },
          (error) => {
            console.error("Firebase listener error:", error);
          }
        );
        
        listenerRef.current.unsubscribe = unsubscribe;
        
        update(dbRef, {
          last_time: Date.now().toString()
        });
      } catch (error) {
        console.error("Error setting up Firebase listener:", error);
      }
    }
    
    // Clean up on unmount
    return () => {
      if (listenerRef.current.unsubscribe) {
        listenerRef.current.unsubscribe();
      }
    };
  }, [path, callback]);
  
  return listenerRef.current;
};

// Create a hook wrapper for compatibility with existing code
export const useToken = () => {
  const { orgId, isLoaded } = useAuth();
  
  const {
    doctorId,
    options,
    currentToken,
    loading,
    allowNotification,
    isPaused,
    updateDoctorId,
    updateToken,
    toggleNotification,
    togglePause,
    setOrgId,
    _isClientUpdate,
    _initialLoad,
    debouncePlayNotification
  } = useTokenStore();
  
  // Set orgId in the store when it changes
  useEffect(() => {
    if (isLoaded && orgId) {
      setOrgId(orgId);
    }
  }, [orgId, isLoaded, setOrgId]);
  
  // Create the Firebase path
  const firebasePath = useMemo(() => {
    if (orgId && doctorId) {
      return `${orgId}/${doctorId}`;
    }
    return null;
  }, [orgId, doctorId]);
  
  // Create a stable callback for the Firebase listener
  const handleDataUpdate = useCallback((data: { token_number: number; paused: boolean; }) => {
    if (!_isClientUpdate && allowNotification && !_initialLoad && 
        (data.token_number !== currentToken || data.paused !== isPaused)) {
      debouncePlayNotification();
    }
    
    useTokenStore.setState({ 
      currentToken: data.token_number,
      isPaused: data.paused || false,
      _isClientUpdate: false
    });
  }, [_isClientUpdate, allowNotification, _initialLoad, currentToken, isPaused, debouncePlayNotification]);
  
  // Set up the Firebase listener
  useFirebaseListener(firebasePath, handleDataUpdate);
  
  // Initialize doctorId from cookie when options are available
  useEffect(() => {
    if (options.length > 0) {
      useTokenStore.getState().initializeDoctorId();
    }
  }, [options]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (useTokenStore.getState()._debounceTimeout !== null) {
        clearTimeout(useTokenStore.getState()._debounceTimeout ?? undefined);
        useTokenStore.setState({ _debounceTimeout: null });
      }
    };
  }, []);
  
  return {
    options,
    doctorId,
    updateDoctorId,
    CurrentToken: currentToken, // Keep the original property name for compatibility
    loading,
    updateToken,
    allowNotification,
    toggleNotification,
    isPaused,
    togglePause
  };
};

// Hook to use with Clerk's useOrganization
export const useTokenWithOrganization = () => {
  const { orgId, isLoaded } = useAuth();
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });
  
  // Set orgId in the store when it changes
  useEffect(() => {
    if (isLoaded && orgId) {
      useTokenStore.getState().setOrgId(orgId);
    }
  }, [orgId, isLoaded]);
  
  // Calculate options from memberships
  const options = useMemo(() => {
    return (
      memberships?.data
        ?.filter((member) => !!member.publicUserData.userId)
        .map((member) => ({
          value: member.publicUserData.userId!,
          label: [
            member.publicUserData.firstName,
            member.publicUserData.lastName,
          ]
            .filter(Boolean)
            .join(" "),
          role: member.role,
        })) ?? []
    );
  }, [memberships]);
  
  // Update options in the store when they change
  useEffect(() => {
    const currentOptions = useTokenStore.getState().options;
    // Only update if options have actually changed to prevent infinite loops
    if (options.length > 0 && JSON.stringify(currentOptions) !== JSON.stringify(options)) {
      useTokenStore.getState().setOptions(options);
    }
  }, [options]);
  
  // Use the regular hook for everything else
  return useToken();
};

// Add missing imports
import { useCallback } from 'react';
