import { create } from 'zustand'

interface NavStore {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isAccountOpen: boolean

  openMobileMenu: () => void
  closeMobileMenu: () => void

  openSearch: () => void
  closeSearch: () => void

  toggleAccount: () => void
  closeAccount: () => void
}

export const useNavStore = create<NavStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAccountOpen: false,

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleAccount: () => set((state) => ({ isAccountOpen: !state.isAccountOpen })),
  closeAccount: () => set({ isAccountOpen: false }),
}))
