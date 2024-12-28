import { auth } from "@/firebase/firebaseConfig";

// Add a staff member
export const addStaff = async (staffData: { email: string; role: string }, doctorId: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        const res = await fetch(`/api/crud-staff?uid=${doctorId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(staffData),
        });

        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}

// Get the staff list
export const getStaff = async (doctorId: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        const res = await fetch(`/api/crud-staff?uid=${doctorId}`, {
            method: 'GET',
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

// Delete a specific staff member by UID
export const deleteStaff = async (staffMailId: string, doctorId: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;

        const res = await fetch(`/api/crud-staff?uid=${doctorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({ staffMailId: staffMailId }), // Only `uid` of the staff member is required in the body
        });

        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}
