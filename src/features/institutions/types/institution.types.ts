/**
 * Institution Types
 */

export type InstitutionType = 'primary' | 'middle' | 'secondary' | 'university' | 'vocational' | 'other'

export interface Institution {
    id: number
    name: string
    name_ar?: string
    type: InstitutionType
    address?: string
    phone?: string
    email?: string
    is_active: boolean
    wilaya_id?: number
    municipality_id?: number
    wilaya?: {
        id: number
        name: string
        name_ar?: string
    }
    municipality?: {
        id: number
        name: string
        name_ar?: string
    }
    created_at?: string
    updated_at?: string
}

export interface InstitutionFilters {
    wilaya_id?: number
    municipality_id?: number
    type?: InstitutionType
    search?: string
    is_active?: boolean
    per_page?: number
    page?: number
}

export interface PaginatedInstitutions {
    success: boolean
    data: Institution[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}
