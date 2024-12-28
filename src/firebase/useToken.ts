import { useState, useEffect, useRef } from "react";
import { realtimeDb } from "@/firebase/firebaseConfig";
import { ref, get, set, update, onValue } from "firebase/database";

const useToken = (doctorID: string) => {
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
        if (doctorID) {
            const dbRef = ref(realtimeDb, doctorID);

            const checkAndUpdateToken = async () => {
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
        }
    }, [doctorID]);

    useEffect(() => {
        if (doctorID) {
            const dbRef = ref(realtimeDb, doctorID);
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
        }
    }, [CurrentToken, allowNotification, doctorID, isPaused]);

    const updateToken = (increment: number) => {
        if (isPaused || CurrentToken + increment < 0) {
            return; // Prevent token number from being negative or updated if paused
        }
        const dbRef = ref(realtimeDb, doctorID);
        const newTokenNumber = CurrentToken + increment;
        setCurrentToken(newTokenNumber);
        isClientUpdate.current = true;
        update(dbRef, {
            token_number: newTokenNumber,
            last_time: new Date().getTime(),
        });
    };

    const togglePause = () => {
        const dbRef = ref(realtimeDb, doctorID);
        const newPauseState = !isPaused;
        setIsPaused(newPauseState);
        isClientUpdate.current = true;
        update(dbRef, {
            paused: newPauseState,
        });
    };

    return { CurrentToken, loading, updateToken, allowNotification, toggleNotification, isPaused, togglePause };
};

export default useToken;
