import { auth } from "@/firebase/firebaseConfig";

export const getSubscription = async (subId: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const res = await fetch(`/api/get-subscription?subId=${subId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching subscription data:", error);
        return { error: error.message || error };
    }
};
