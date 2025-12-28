import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/store/types'
import { format } from 'date-fns'
import type { ProfileFormValues } from '@/schemas/profile-schema'

export function useUpdateProfile(userId: number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (values: ProfileFormValues) => {
            // Format payload logic extracted from component
            const payload = {
                ...values,
                date_of_birth: values.date_of_birth ? format(values.date_of_birth, 'yyyy-MM-dd') : null,
                date_of_hiring: values.date_of_hiring ? format(values.date_of_hiring, 'yyyy-MM-dd') : null,
            }

            const response = await apiClient.put<{ data: User }>(`/v1/users/${userId}`, payload)
            return response.data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}
