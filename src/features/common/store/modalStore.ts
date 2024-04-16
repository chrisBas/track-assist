import { create } from 'zustand';

export type ModalType = { modal: 'confirm-delete'; onDelete: () => void };

export const useModalStore = create<{
  modal: null | ModalType;
  setModal: (modal: null | ModalType) => void;
}>((set) => ({
  modal: null,
  setModal: (modal) => set({ modal }),
}));
