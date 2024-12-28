export const tokenVerify = async () => {
    try {
        const res = await fetch(`https://preview.dashboard.dardibook.in/api/token-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}