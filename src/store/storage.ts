import type { StateStorage } from 'zustand/middleware'

/**
 * Storage adapter for Zustand persist middleware
 * Using localStorage as the default storage mechanism
 */
export const authStorage: StateStorage = localStorage
export const settingsStorage: StateStorage = localStorage
