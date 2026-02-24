import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Sidebar state
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Modal states
  activeModal: null,
  modalData: null,
  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Confirmation dialog
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  },
  showConfirmDialog: (config) => set({ 
    confirmDialog: { isOpen: true, ...config } 
  }),
  hideConfirmDialog: () => set({ 
    confirmDialog: { isOpen: false, title: '', message: '', onConfirm: null, onCancel: null } 
  }),

  // Selected items for bulk actions
  selectedItems: [],
  setSelectedItems: (items) => set({ selectedItems: items }),
  clearSelectedItems: () => set({ selectedItems: [] }),
  toggleItemSelection: (id) => set((state) => ({
    selectedItems: state.selectedItems.includes(id)
      ? state.selectedItems.filter(item => item !== id)
      : [...state.selectedItems, id]
  }))
}));