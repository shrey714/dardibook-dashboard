import { useState, useEffect, useRef, useMemo } from "react";
import { realtimeDb } from "@/firebase/firebaseConfig";
import { ref, get, set, update, onValue } from "firebase/database";
import { useAuth, useOrganization } from "@clerk/nextjs";

interface Option {
    value: string;
    label: string;
    role: string;
}

const useToken = () => {

    const { memberships } = useOrganization({
        memberships: {
            infinite: true,
            keepPreviousData: true,
            role: ["org:doctor", "org:clinic_head"],
        },
    });

    const options: Option[] = useMemo(() => {
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

    const [doctorId, setDoctorId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && options.length > 0) {
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith("TOKEN_ACTIVE_DOCTOR"))
                ?.split("=")[1];

            setDoctorId(options.find((option) => option.value === cookieValue)?.value ?? null);
        }
    }, [options]);

    const { orgId, isLoaded } = useAuth();
    const [CurrentToken, setCurrentToken] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allowNotification, setAllowNotification] = useState(false);
    const [isPaused, setIsPaused] = useState(false); // Add state for pause
    const isClientUpdate = useRef(false);
    const debounceTimeout = useRef<number | null>(null);
    const initialLoad = useRef(true);

    const playNotification = () => {
        const audio = new Audio('/token_sound_2.mp3');
        audio.play().catch(error => {
            console.error('Error playing notification sound:', error);
        });
    };

    const toggleNotification = (allow: boolean) => {
        setAllowNotification(allow);
    };

    useEffect(() => {
        if (orgId && isLoaded && doctorId) {
            const dbRef = ref(realtimeDb, orgId + "/" + doctorId);

            const checkAndUpdateToken = async () => {
                setLoading(true);
                initialLoad.current = true;
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const currentTime = new Date().setHours(0, 0, 0, 0);
                    const lastTime = new Date(parseInt(data.last_time, 10)).setHours(0, 0, 0, 0);
                    if (lastTime !== currentTime) {
                        set(dbRef, {
                            last_time: Date.now().toString(),
                            token_number: 0,
                            paused: false, // Initialize paused state
                        });
                        setCurrentToken(0);
                        setIsPaused(false);
                    } else {
                        setCurrentToken(data.token_number);
                        setIsPaused(data.paused); // Set the paused state
                    }
                } else {
                    set(dbRef, {
                        last_time: Date.now().toString(),
                        token_number: 0,
                        paused: false, // Initialize paused state
                    });
                    setCurrentToken(0);
                }
                setLoading(false);
                initialLoad.current = false; // Mark initial load as complete
            };

            checkAndUpdateToken();
        } else {
            setIsPaused(true)
        }
    }, [doctorId, isLoaded, orgId]);

    useEffect(() => {
        if (orgId && isLoaded && doctorId) {
            const dbRef = ref(realtimeDb, orgId + "/" + doctorId);
            const debouncePlayNotification = () => {
                if (debounceTimeout.current !== null) {
                    clearTimeout(debounceTimeout.current);
                }
                debounceTimeout.current = window.setTimeout(() => {
                    if (allowNotification) {
                        playNotification();
                    }

                }, 500); // Adjust the delay as needed (300ms in this example)
            };

            // Listen for real-time updates
            const unsubscribe = onValue(dbRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    if (!isClientUpdate.current && allowNotification && !initialLoad.current && (data.token_number !== CurrentToken || data.paused !== isPaused)) {
                        debouncePlayNotification();
                    }
                    setCurrentToken(data.token_number);
                    setIsPaused(data.paused); // Update paused state
                    isClientUpdate.current = false;
                }
            });

            // Cleanup listener on component unmount
            return () => unsubscribe();
        } else {
            setIsPaused(true);
        }
    }, [CurrentToken, allowNotification, doctorId, isLoaded, isPaused, orgId]);

    const updateToken = (increment: number) => {
        if (isPaused || CurrentToken + increment < 0 || !orgId || !isLoaded || !doctorId) {
            return; // Prevent token number from being negative or updated if paused
        }
        const dbRef = ref(realtimeDb, orgId + "/" + doctorId);
        const newTokenNumber = CurrentToken + increment;
        setCurrentToken(newTokenNumber);
        isClientUpdate.current = true;
        update(dbRef, {
            token_number: newTokenNumber,
            last_time: new Date().getTime(),
        });
    };

    const togglePause = () => {
        if (!orgId || !isLoaded || !doctorId) {
            return;
        }
        const dbRef = ref(realtimeDb, orgId + "/" + doctorId);
        const newPauseState = !isPaused;
        setIsPaused(newPauseState);
        isClientUpdate.current = true;
        update(dbRef, {
            paused: newPauseState,
        });
    };

    const updateDoctorId = (id: string) => {
        setDoctorId(id);
        document.cookie = `TOKEN_ACTIVE_DOCTOR=${encodeURIComponent(id)}; path=/; Secure; SameSite=Strict;`;
    };

    return { options, doctorId, updateDoctorId, CurrentToken, loading, updateToken, allowNotification, toggleNotification, isPaused, togglePause };
};

export default useToken;
