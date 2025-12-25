import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

import { settingsStorage } from './storage'

/**
 * App Settings State
 */
interface SettingsState {
  language: 'en' | 'fr' | 'ar'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  notificationsEnabled: boolean
  soundEnabled: boolean
  compactMode: boolean
  itemsPerPage: number
}

/**
 * App Settings Actions
 */
interface SettingsActions {
  setLanguage: (language: SettingsState['language']) => void
  setDateFormat: (format: SettingsState['dateFormat']) => void
  toggleNotifications: () => void
  toggleSound: () => void
  toggleCompactMode: () => void
  setItemsPerPage: (count: number) => void
  resetSettings: () => void
}

/**
 * Combined Settings Store Type
 */
type SettingsStore = SettingsState & SettingsActions

/**
 * Default settings
 */
const defaultSettings: SettingsState = {
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  notificationsEnabled: true,
  soundEnabled: true,
  compactMode: false,
  itemsPerPage: 10,
}

/**
 * Settings Store
 * 
 * Manages application-wide settings with IndexedDB persistence.
 * 
 * @example
 * ```tsx
 * import { useSettingsStore } from '@/store/settings-store'
 * 
 * function SettingsPage() {
 *   const {
 *     language,
 *     dateFormat,
 *     setLanguage,
 *     setDateFormat,
 *     toggleNotifications,
 *     notificationsEnabled
 *   } = useSettingsStore()
 *   
 *   return (
 *     <div>
 *       <select value={language} onChange={(e) => setLanguage(e.target.value)}>
 *         <option value="en">English</option>
 *         <option value="fr">Français</option>
 *         <option value="ar">العربية</option>
 *       </select>
 *       
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={notificationsEnabled}
 *           onChange={toggleNotifications}
 *         />
 *         Enable notifications
 *       </label>
 *     </div>
 *   )
 * }
 * ```
 */
export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...defaultSettings,

        setLanguage: (language) =>
          set(
            { language },
            false,
            'settings/setLanguage'
          ),

        setDateFormat: (dateFormat) =>
          set(
            { dateFormat },
            false,
            'settings/setDateFormat'
          ),

        toggleNotifications: () =>
          set(
            (state) => ({ notificationsEnabled: !state.notificationsEnabled }),
            false,
            'settings/toggleNotifications'
          ),

        toggleSound: () =>
          set(
            (state) => ({ soundEnabled: !state.soundEnabled }),
            false,
            'settings/toggleSound'
          ),

        toggleCompactMode: () =>
          set(
            (state) => ({ compactMode: !state.compactMode }),
            false,
            'settings/toggleCompactMode'
          ),

        setItemsPerPage: (itemsPerPage) =>
          set(
            { itemsPerPage },
            false,
            'settings/setItemsPerPage'
          ),

        resetSettings: () =>
          set(
            defaultSettings,
            false,
            'settings/reset'
          ),
      }),
      {
        name: 'app-settings',
        storage: createJSONStorage(() => settingsStorage), // Using IndexedDB
      }
    ),
    { name: 'SettingsStore' }
  )
)

/**
 * Selector hooks for optimized re-renders
 */
export const useLanguage = () => useSettingsStore((state) => state.language)
export const useDateFormat = () => useSettingsStore((state) => state.dateFormat)
export const useCompactMode = () => useSettingsStore((state) => state.compactMode)
