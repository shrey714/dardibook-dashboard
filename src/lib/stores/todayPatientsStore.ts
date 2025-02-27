import { createStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { collection, DocumentData, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { startOfDay, endOfDay, getTime } from "date-fns";

export type TodayPatientsState = {
  patientsData: any;
  loading: boolean;
};

export type TodayPatientsActions = {
  getTodayPatients: (orgId: string) => void;
};

export type TodayPatientsStore = TodayPatientsState & TodayPatientsActions;

export const initStore = (): TodayPatientsState => ({
  patientsData: null,
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

        const now = new Date();
        const todaysPatientsDoc = query(
          collection(db, "doctor", orgId, "patients"),
          where("last_visited", ">=", getTime(startOfDay(now))),
          where("last_visited", "<=", getTime(endOfDay(now))),
          orderBy("last_visited", "desc")
        );

        onSnapshot(todaysPatientsDoc, (snapshot) => {
          const patientData: DocumentData[] = [];

          snapshot.forEach((doc) => {
            const pData = doc.data();
            const visitedDatesArray = pData?.visitedDates || [];
            const today = new Date().getDate();

            const attended = visitedDatesArray.some(
              (date: number) => new Date(date).getDate() === today
            );

            const old = visitedDatesArray.length > 1 || (visitedDatesArray.length === 1 && !attended);

            patientData.push({ ...pData, attended, old });
          });

            set({ patientsData: patientData, loading: false });
        });
      }
    }))
  );
};
