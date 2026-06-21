'use client'

import { create } from 'zustand'

interface AuthUiStore {
  loginOpen: boolean
  /** Runs once after a successful login (e.g. continue to checkout). */
  pendingAction: (() => void) | null
  profileSetupOpen: boolean

  openLogin: (onSuccess?: () => void) => void
  closeLogin: () => void
  runPendingAction: () => void

  openProfileSetup: () => void
  closeProfileSetup: () => void
}

export const useAuthUi = create<AuthUiStore>((set, get) => ({
  loginOpen: false,
  pendingAction: null,
  profileSetupOpen: false,

  openLogin: (onSuccess) => set({ loginOpen: true, pendingAction: onSuccess ?? null }),
  closeLogin: () => set({ loginOpen: false }),
  runPendingAction: () => {
    const action = get().pendingAction
    set({ pendingAction: null })
    action?.()
  },

  openProfileSetup: () => set({ profileSetupOpen: true }),
  closeProfileSetup: () => set({ profileSetupOpen: false }),
}))
