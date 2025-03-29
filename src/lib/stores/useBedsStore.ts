import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { collection, doc, onSnapshot, getDoc, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { OrgBed, BedPatientTypes } from "@/types/FormTypes";

interface BedsState {
    beds: OrgBed[];
    bedPatients: Record<string, BedPatientTypes>;
    loading: boolean;
    fetchBeds: (orgId: string) => void;
}

export const useBedsStore = create<BedsState>()(
    subscribeWithSelector((set, get) => ({
        beds: [],
        bedPatients: {},
        loading: true,

        fetchBeds: (orgId: string) => {
            set({ loading: true });

            const bedsQuery = query(collection(db, "doctor", orgId, "beds"), where("dischargeMarked", "==", false));

            const unsubscribeBeds = onSnapshot(bedsQuery, async (snapshot) => {
                const bedsData: OrgBed[] = [];
                const patientIds = new Set<string>();

                snapshot.forEach((doc) => {
                    const bed = doc.data() as OrgBed;
                    bedsData.push(bed);
                    patientIds.add(bed.patient_id)
                });

                set({ beds: bedsData });

                const existingPatients = get().bedPatients;
                const newPatientIds = Array.from(patientIds).filter(
                    (id) => !existingPatients[id]
                );

                if (newPatientIds.length > 0) {
                    fetchPatients(orgId, newPatientIds, set);
                }

                set({ loading: false });
            });

            return () => unsubscribeBeds();
        },
    }))
);

const fetchPatients = async (
    orgId: string, newPatientIds: string[], set: { (partial: BedsState | Partial<BedsState> | ((state: BedsState) => BedsState | Partial<BedsState>), replace?: false): void; (state: BedsState | ((state: BedsState) => BedsState), replace: true): void; },
) => {
    const patientsData: Record<string, BedPatientTypes> = {};

    await Promise.all(
        newPatientIds.map(async (patientId) => {
            const patientRef = doc(db, "doctor", orgId, "patients", patientId);
            const patientSnap = await getDoc(patientRef);

            if (patientSnap.exists()) {
                const { patient_id, name, mobile, gender, age } = patientSnap.data();
                patientsData[patientId] = { patient_id, name, mobile, gender, age };
            }
        })
    );

    set({ bedPatients: patientsData });
};


