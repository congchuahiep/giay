import { create } from "zustand";

type ModalType = null | "settings" | "shortcut" | "profile";

type ModalState = {
  open: boolean;
  type: ModalType;
  data?: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
};

export const useGlobalModalStore = create<ModalState>((set) => ({
  open: false,
  type: null,
  data: undefined,
  openModal: (type, data) => set({ open: true, type, data }),
  closeModal: () => set({ open: false, type: null, data: undefined }),
}));
