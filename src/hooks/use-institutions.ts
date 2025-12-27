import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export interface Wilaya {
  id: number
  code: string
  name: string
  name_ar: string | null
  municipalities_count?: number
  institutions_count?: number
}

export interface Municipality {
  id: number
  wilaya_id: number
  name: string
  name_ar: string | null
  wilaya?: Wilaya
  institutions_count?: number
}

export interface Institution {
  id: number
  wilaya_id: number
  municipality_id: number
  name: string
  name_ar: string | null
  address: string | null
  phone: string | null
  email: string | null
  type: 'primary' | 'middle' | 'secondary' | 'university' | 'vocational' | 'other'
  is_active: boolean
  wilaya?: Wilaya
  municipality?: Municipality
  created_at: string
  updated_at: string
  deleted_at?: string
}

interface InstitutionsResponse {
  success: boolean
  data: Institution[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

interface InstitutionResponse {
  success: boolean
  data: Institution
}

interface WilayasResponse {
  success: boolean
  data: Wilaya[]
}

interface MunicipalitiesResponse {
  success: boolean
  data: Municipality[]
}

interface InstitutionFilters {
  wilaya_id?: number
  municipality_id?: number
  type?: string
  search?: string
  is_active?: boolean
  per_page?: number
  page?: number
}

interface CreateInstitutionData {
  wilaya_id: number
  municipality_id: number
  name: string
  name_ar?: string
  address?: string
  phone?: string
  email?: string
  type: string
  is_active?: boolean
}

// Fetch all wilayas
export function useWilayas() {
  return useQuery<Wilaya[]>({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const response = await apiClient.get<WilayasResponse>('/v1/wilayas')
      return response.data.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour (wilayas don't change)
  })
}

// Fetch municipalities for a wilaya
export function useMunicipalities(wilayaId: number | undefined) {
  return useQuery<Municipality[]>({
    queryKey: ['municipalities', wilayaId],
    queryFn: async () => {
      const response = await apiClient.get<MunicipalitiesResponse>(`/v1/wilayas/${wilayaId}/municipalities`)
      return response.data.data
    },
    enabled: !!wilayaId,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Fetch institutions with filters
export function useInstitutions(filters: InstitutionFilters = {}, options: { enabled?: boolean } = {}) {
  return useQuery<InstitutionsResponse>({
    queryKey: ['institutions', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value))
        }
      })
      const response = await apiClient.get<InstitutionsResponse>(`/v1/institutions?${params.toString()}`)
      return response.data
    },
    enabled: options.enabled,
  })
}

// Fetch single institution
export function useInstitution(id: number) {
  return useQuery<Institution>({
    queryKey: ['institutions', id],
    queryFn: async () => {
      const response = await apiClient.get<InstitutionResponse>(`/v1/institutions/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

// Create institution
export function useCreateInstitution() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (data: CreateInstitutionData) => {
      const response = await apiClient.post<InstitutionResponse>('/v1/institutions', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
      toast.success(t('common.createSuccess'))
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.error'))
    },
  })
}

// Update institution
export function useUpdateInstitution() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateInstitutionData> }) => {
      const response = await apiClient.put<InstitutionResponse>(`/v1/institutions/${id}`, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
      toast.success(t('common.updateSuccess'))
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.error'))
    },
  })
}

// Delete institution
export function useDeleteInstitution() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/v1/institutions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
      toast.success(t('common.deleteSuccess'))
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.error'))
    },
  })
}

// Restore institution
export function useRestoreInstitution() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/v1/institutions/${id}/restore`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
      toast.success(t('pages.institutions.restored'))
    },
    onError: (error: Error) => {
      toast.error(error.message || t('common.error'))
    },
  })
}
