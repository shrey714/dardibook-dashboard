import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { startOfDay, getTime, isSameDay } from "date-fns";
import { RegisterPatientFormTypes, TodayPatientsType } from "@/types/FormTypes";

export type TodayPatientsState = {
  todayPatients: TodayPatientsType[];
  loading: boolean;
};

export type TodayPatientsActions = {
  getTodayPatients: (orgId: string) => void;
};

export type TodayPatientsStore = TodayPatientsState & TodayPatientsActions;

export const initStore = (): TodayPatientsState => ({
  todayPatients: [],
  loading: false,
});

export const defaultInitState: TodayPatientsState = initStore();

export const createTodayPatientsStore = (
  initState: TodayPatientsState = defaultInitState
) => {
  return createStore<TodayPatientsStore>()(
    immer((set) => ({
      ...initState,

      getTodayPatients: (orgId: string) => {
        if (!orgId) return;

        set({ loading: true });

        const today = new Date();
        const todaysPatientsDoc = query(
          collection(db, "doctor", orgId, "patients"),
          where("registered_date", "array-contains", getTime(startOfDay(today)))
        );

        onSnapshot(todaysPatientsDoc, (snapshot) => {
          const patientData: TodayPatientsType[] = [];

          snapshot.forEach((doc) => {
            const patientDoc = doc.data() as RegisterPatientFormTypes;
            patientData.push({
              patient_id: patientDoc.patient_id,
              name: patientDoc.name,
              mobile: patientDoc.mobile,
              gender: patientDoc.gender,
              registered_date: patientDoc.registered_date,
              registered_date_time: patientDoc.registered_date_time,
              registerd_by: patientDoc.registerd_by,
              registerd_for: patientDoc.registerd_for,
              prescribed: patientDoc.prescribed_date_time.some((dateTime) =>
                isSameDay(dateTime, today)
              ),
              inBed: patientDoc.bed_info.some((bed) =>
                bed.admission_at <= getTime(new Date()) &&
                bed.discharge_at >= getTime(new Date())
              ),
            });
          });

          set({ todayPatients: patientData.sort((a, b) => b.registered_date_time.filter((date_time) => isSameDay(date_time, today))[0] - a.registered_date_time.filter((date_time) => isSameDay(date_time, today))[0]), loading: false });
        });
      }
    }))
  );
};
