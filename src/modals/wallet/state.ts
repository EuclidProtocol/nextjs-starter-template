import { create } from "zustand";

interface ModalState {
    isModalOpen: boolean;
    onModalStateChange: (open: boolean) => void;
}

export const useWalletModalStore = create<ModalState>((set) => ({
    isModalOpen: false,
    onModalStateChange: (open: boolean) => set({ isModalOpen: open }),
}));
