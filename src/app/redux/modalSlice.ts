import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Template from '@dataTypes/Template';
import type { RootState } from './store';

export interface ModalState {
  newTemplateModal: {
    isOpen: boolean;
    templateToCopy?: Template;
  };
  toolsModal: {
    isOpen: boolean;
  };
}

const initialState: ModalState = {
  newTemplateModal: {
    isOpen: false,
    templateToCopy: undefined,
  },
  toolsModal: {
    isOpen: false,
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openNewTemplateModal: (state, action: PayloadAction<{ templateToCopy?: Template }>) => {
      state.newTemplateModal.isOpen = true;
      state.newTemplateModal.templateToCopy = action.payload.templateToCopy;
    },
    closeNewTemplateModal: (state) => {
      state.newTemplateModal.isOpen = false;
      state.newTemplateModal.templateToCopy = undefined;
    },
    toggleNewTemplateModal: (state) => {
      state.newTemplateModal.isOpen = !state.newTemplateModal.isOpen;
      if (!state.newTemplateModal.isOpen) {
        state.newTemplateModal.templateToCopy = undefined;
      }
    },
    openToolsModal: (state) => {
      state.toolsModal.isOpen = true;
    },
    closeToolsModal: (state) => {
      state.toolsModal.isOpen = false;
    },
    toggleToolsModal: (state) => {
      state.toolsModal.isOpen = !state.toolsModal.isOpen;
    },
    closeAllModals: (state) => {
      state.newTemplateModal.isOpen = false;
      state.newTemplateModal.templateToCopy = undefined;
      state.toolsModal.isOpen = false;
    },
  },
});

export const {
  openNewTemplateModal,
  closeNewTemplateModal,
  toggleNewTemplateModal,
  openToolsModal,
  closeToolsModal,
  toggleToolsModal,
  closeAllModals,
} = modalSlice.actions;

// Selectors
export const selectNewTemplateModal = (state: RootState) => state.modal.newTemplateModal;
export const selectToolsModal = (state: RootState) => state.modal.toolsModal;
export const selectIsNewTemplateModalOpen = (state: RootState) => state.modal.newTemplateModal.isOpen;
export const selectIsToolsModalOpen = (state: RootState) => state.modal.toolsModal.isOpen;
export const selectTemplateToCopy = (state: RootState) => state.modal.newTemplateModal.templateToCopy;

export default modalSlice.reducer;