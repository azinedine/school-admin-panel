import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Notification } from './types'

/**
 * UI Store State
 */
interface UIState {
  sidebarOpen: boolean
  isMobileSidebarOpen: boolean
  activeModal: string | null
  notifications: Notification[]
  isLoading: boolean
  loadingMessage: string
}

/**
 * UI Store Actions
 */
interface UIActions {
  // Sidebar
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
  
  // Modals
  openModal: (modalId: string) => void
  closeModal: () => void
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Loading
  setLoading: (loading: boolean, message?: string) => void
}

/**
 * Combined UI Store Type
 */
type UIStore = UIState & UIActions

/**
 * UI Store
 * 
 * Manages global UI state like sidebars, modals, and notifications.
 * 
 * @example
 * ```tsx
 * import { useUIStore } from '@/store/ui-store'
 * 
 * function Sidebar() {
 *   const { sidebarOpen, toggleSidebar } = useUIStore()
 *   
 *   return (
 *     <aside className={sidebarOpen ? 'open' : 'closed'}>
 *       <button onClick={toggleSidebar}>Toggle</button>
 *     </aside>
 *   )
 * }
 * 
 * // Show notification
 * function SaveButton() {
 *   const { addNotification } = useUIStore()
 *   
 *   const handleSave = async () => {
 *     await saveData()
 *     addNotification({
 *       type: 'success',
 *       message: 'Saved successfully!',
 *       duration: 3000
 *     })
 *   }
 * }
 * ```
 */
export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      isMobileSidebarOpen: false,
      activeModal: null,
      notifications: [],
      isLoading: false,
      loadingMessage: '',

      // Sidebar actions
      toggleSidebar: () =>
        set(
          (state) => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          'ui/toggleSidebar'
        ),

      setSidebarOpen: (open) =>
        set(
          { sidebarOpen: open },
          false,
          'ui/setSidebarOpen'
        ),

      toggleMobileSidebar: () =>
        set(
          (state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen }),
          false,
          'ui/toggleMobileSidebar'
        ),

      // Modal actions
      openModal: (modalId) =>
        set(
          { activeModal: modalId },
          false,
          'ui/openModal'
        ),

      closeModal: () =>
        set(
          { activeModal: null },
          false,
          'ui/closeModal'
        ),

      // Notification actions
      addNotification: (notification) =>
        set(
          (state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id: Date.now().toString() },
            ],
          }),
          false,
          'ui/addNotification'
        ),

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          'ui/removeNotification'
        ),

      clearNotifications: () =>
        set(
          { notifications: [] },
          false,
          'ui/clearNotifications'
        ),

      // Loading actions
      setLoading: (loading, message = '') =>
        set(
          { isLoading: loading, loadingMessage: message },
          false,
          'ui/setLoading'
        ),
    }),
    { name: 'UIStore' }
  )
)

/**
 * Selector hooks for optimized re-renders
 */
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen)
export const useActiveModal = () => useUIStore((state) => state.activeModal)
export const useNotifications = () => useUIStore((state) => state.notifications)
export const useIsLoading = () => useUIStore((state) => state.isLoading)
