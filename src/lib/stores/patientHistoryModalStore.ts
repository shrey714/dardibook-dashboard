import { create } from "zustand";

type HistoryModalProps = {
    patientId: string;
};

type HistoryModalState = {
    isOpen: boolean;
    modalProps: HistoryModalProps;
    openModal: (props: HistoryModalProps) => void;
    closeModal: () => void;
};

export const usePatientHistoryModalStore = create<HistoryModalState>((set) => ({
    isOpen: false,
    modalProps: { patientId: "" },
    openModal: (props) => {
        set({ isOpen: true, modalProps: props })
    },
    closeModal: () => set({ isOpen: false }),
}));
