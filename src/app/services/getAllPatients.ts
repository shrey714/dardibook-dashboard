import { toast } from 'react-hot-toast';

export const getAllPatients = async (doctorId: string) => {
    try {
        const fetchPatients = fetch(`/api/get-all-patients?doctorId=${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const res = await toast.promise(
            fetchPatients,
            {
                loading: 'Loading patients...',
                success: 'Patients data retrieved successfully!',
                error: 'Failed to load patients data.',
            }
        );

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        return { error: error };
    }
};
