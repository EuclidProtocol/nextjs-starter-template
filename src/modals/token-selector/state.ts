import { create } from "zustand";

interface ModalState {
    isModalOpen: boolean;
    tokens: string[];
    title: string;
    description: string;
    onTokenSelect: (token: string) => void;
    onCloseModal: () => void;
    onOpenModal: (data: Omit<ModalState, "onCloseModal" | "onOpenModal" | "isModalOpen">) => void;
}

export const useTokenSelectorModalStore = create<ModalState>((set) => ({
    isModalOpen: false,
    onModalStateChange: (open: boolean) => set({ isModalOpen: open }),
    tokens: [],
    title: "Select Token",
    description: "Select the token you want to swap",
    onTokenSelect: () => {
        throw new Error("Not implemented");
    },
    onCloseModal: () => {
        set({ isModalOpen: false });
    },
    onOpenModal: (data) => {
        set({ ...data, isModalOpen: true });
    },
}));
