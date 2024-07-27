export const checkSubscriptionStatus = async (userId: string) => {
    try {
        const res = await fetch(`/api/check-subscription?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        return { error: error };
    }
};
