/**
 * Institution Store
 * 
 * Zustand store for GLOBAL UI STATE only.
 * Stores the active institution ID with persistence.
 * 
 * NO server state here - that belongs to TanStack Query.
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

// =============================================================================
// Types
// =============================================================================

interface InstitutionStoreState {
    activeInstitutionId: number | null
}

interface InstitutionStoreActions {
    setActiveInstitution: (id: number | null) => void
    reset: () => void
}

type InstitutionStore = InstitutionStoreState & InstitutionStoreActions

// =============================================================================
// Initial State
// =============================================================================

const initialState: InstitutionStoreState = {
    activeInstitutionId: null,
}

// =============================================================================
// Store
// =============================================================================

export const useInstitutionStore = create<InstitutionStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,

                setActiveInstitution: (id) =>
                    set(
                        { activeInstitutionId: id },
                        false,
                        'institution/setActive'
                    ),

                reset: () =>
                    set(
                        initialState,
                        false,
                        'institution/reset'
                    ),
            }),
            {
                name: 'institution-storage',
                storage: createJSONStorage(() => localStorage),
            }
        ),
        { name: 'InstitutionStore' }
    )
)

// =============================================================================
// Selectors
// =============================================================================

export const useActiveInstitutionId = () =>
    useInstitutionStore((s) => s.activeInstitutionId)

export const useSetActiveInstitution = () =>
    useInstitutionStore((s) => s.setActiveInstitution)
