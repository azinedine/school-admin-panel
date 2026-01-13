import { useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useRegister } from '@/hooks/use-auth'
import { createRegistrationSchema, registrationDefaults, type RegistrationFormData, type RegistrationPayload } from '@/schemas/registration'
import { toast } from 'sonner'

export function useRegisterForm() {
    const { t, i18n } = useTranslation()
    const isRTL = i18n.dir() === 'rtl'

    const { mutate: registerUser, isPending: loading } = useRegister()

    const registrationSchema = useMemo(() => createRegistrationSchema(t), [t])

    // Initialize Form
    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema) as Resolver<RegistrationFormData>,
        // Cast defaults to satisfy the Union type expected by useForm
        defaultValues: registrationDefaults as unknown as RegistrationFormData,
        mode: 'onChange'
    })

    const { handleSubmit, watch } = methods
    const role = watch('role')

    // Submission
    const onSubmit = (data: RegistrationFormData) => {
        // initialize payload with common fields
        const basePayload = {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password,
            role: data.role,
            wilaya: data.wilaya,
            municipality: data.municipality,
            institution_id: data.institution_id,
        };

        let rolePayload: Partial<RegistrationPayload> = {};

        switch (data.role) {
            case 'teacher':
                rolePayload = {
                    name_ar: data.name_ar,
                    gender: data.gender,
                    date_of_birth: data.date_of_birth,
                    phone: data.phone,
                    years_of_experience: data.years_of_experience,
                    subjects: data.subjects,
                    levels: data.levels,
                };
                break;
            case 'student':
                rolePayload = {
                    class: data.class,
                };
                break;
            case 'parent':
                rolePayload = {
                    linkedStudentId: data.linkedStudentId,
                };
                break;
            case 'admin':
                rolePayload = {
                    department: data.department,
                    position: data.position,
                    date_of_hiring: data.dateOfHiring,
                    work_phone: data.workPhone,
                    office_location: data.officeLocation,
                    notes: data.notes,
                };
                break;
        }

        const payload: RegistrationPayload = {
            ...basePayload,
            ...rolePayload,
        }

        registerUser(payload)
    }

    const onError = () => {
        toast.error(t('auth.validation.checkFields', 'Please check the form for errors'))
    }

    return {
        methods,
        handleSubmit,
        onSubmit,
        onError,
        loading,
        role,
        t,
        isRTL
    }
}
