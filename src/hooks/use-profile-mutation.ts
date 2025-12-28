import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/store/types'
import { format } from 'date-fns'

export function useUpdateProfile(userId: number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (values: {
            name: string;
            email: string;
            name_ar?: string;
            phone?: string;
            address?: string;
            gender?: 'male' | 'female';
            date_of_birth?: string;
            wilaya?: string;
            municipality?: string;
            institution_id?: string;
            work_phone?: string;
            office_location?: string;
            date_of_hiring?: string;
            years_of_experience?: number;
        }) => {
            // Format payload logic extracted from component
            const payload = {
                ...values,
                date_of_birth: values.date_of_birth ? format(new Date(values.date_of_birth), 'yyyy-MM-dd') : null,
                date_of_hiring: values.date_of_hiring ? format(new Date(values.date_of_hiring), 'yyyy-MM-dd') : null,
            }

            const response = await apiClient.put<{ data: User }>(`/v1/users/${userId}`, payload)
            return response.data.data
        },
        onSuccess: (data) => {
            // Immediate UI update via cache
            queryClient.setQueryData(['user', userId], data)
            // Also update the 'user' key which might be used by useAuth
            queryClient.setQueryData(['user'], data)

            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}
