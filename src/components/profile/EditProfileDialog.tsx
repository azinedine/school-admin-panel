import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { TextField, SelectField, DatePicker, ActionButton } from '@/components/forms'
import { useWilayas, useMunicipalities, useInstitutionsByLocation, useInstitution } from '@/hooks/use-institutions'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/store/types'
import { profileSchema, type ProfileFormValues } from '@/schemas/profile-schema'
import { useUpdateProfile } from '@/hooks/use-profile-mutation'
import { toast } from 'sonner'

// Mapped type for form inputs (native date inputs use strings)
type ProfileFormInputValues = {
  name: string
  name_ar?: string
  email: string
  phone?: string
  address?: string
  gender?: 'male' | 'female'
  date_of_birth?: string
  wilaya?: string
  municipality?: string
  institution_id?: string
  work_phone?: string
  office_location?: string
  date_of_hiring?: string
  years_of_experience?: number | string
}

interface EditProfileDialogProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function EditProfileDialog({ user, isOpen, onClose }: EditProfileDialogProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(user.id)
  const { setUser } = useAuthStore()

  // Use ProfileFormInputValues to allow string dates in defaultValues
  const form = useForm<ProfileFormInputValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: user.name || '',
      name_ar: user.name_ar || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender || undefined,
      // Format dates for native date input (YYYY-MM-DD)
      date_of_birth: user.date_of_birth ? format(new Date(user.date_of_birth), 'yyyy-MM-dd') : undefined,
      wilaya: user.wilaya || '',
      municipality: user.municipality || '',
      institution_id: user.institution?.id.toString() || '',
      work_phone: user.work_phone || '',
      office_location: user.office_location || '',
      date_of_hiring: user.date_of_hiring ? format(new Date(user.date_of_hiring), 'yyyy-MM-dd') : undefined,
      years_of_experience: user.years_of_experience ?? undefined,
    },
  })

  // Watch for cascading selects
  const selectedWilaya = form.watch('wilaya')
  const selectedMunicipality = form.watch('municipality')

  // Fetch data
  const { data: wilayas } = useWilayas()
  const { data: municipalities } = useMunicipalities(
    selectedWilaya ? parseInt(selectedWilaya) : undefined
  )
  const { data: institutionsData, isLoading: loadingInstitutions } = useInstitutionsByLocation(
    selectedWilaya ? parseInt(selectedWilaya) : undefined,
    selectedMunicipality ? parseInt(selectedMunicipality) : undefined,
    { enabled: !!selectedWilaya && !!selectedMunicipality }
  )
  
  // Get current institution details to pre-fill location if needed
  const { data: currentInstitution } = useInstitution(
    user.institution?.id ? user.institution.id : 0,
  )

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: user.name || '',
        name_ar: user.name_ar || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender || undefined,
        date_of_birth: user.date_of_birth ? format(new Date(user.date_of_birth), 'yyyy-MM-dd') : undefined,
        wilaya: user.wilaya || '',
        municipality: user.municipality || '',
        institution_id: user.institution?.id.toString() || '',
        work_phone: user.work_phone || '',
        office_location: user.office_location || '',
        date_of_hiring: user.date_of_hiring ? format(new Date(user.date_of_hiring), 'yyyy-MM-dd') : undefined,
        years_of_experience: user.years_of_experience ?? undefined,
      })
    }
  }, [user, isOpen, form])

  // Pre-fill location based on current institution
  useEffect(() => {
    if (isOpen && currentInstitution && !form.getValues('wilaya')) {
      if (currentInstitution.wilaya_id) {
         form.setValue('wilaya', currentInstitution.wilaya_id.toString())
      }
      if (currentInstitution.municipality_id) {
        setTimeout(() => {
           form.setValue('municipality', currentInstitution.municipality_id.toString())
        }, 100)
      }
    }
  }, [isOpen, currentInstitution, form])


  const institutions = institutionsData?.data || []
  const hasInstitutions = institutions.length > 0
  const noInstitutionsFound = !!selectedMunicipality && !loadingInstitutions && !hasInstitutions

  // The resolver returns ProfileFormValues (with Dates), so we use that type for the handler
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const updatedUser = await updateProfile(values)
      setUser(updatedUser as User) // Ensure compatible type if needed
      toast.success(t('common.updateSuccess', 'Profile updated successfully'))
      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(t('common.error', 'Failed to update profile'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('profilePage.editProfile', 'Edit Profile')}</DialogTitle>
          <DialogDescription>
            {t('profilePage.editProfileDesc', 'Update your personal information.')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <TextField
                name="name"
                label={t('profilePage.fullName')}
                placeholder="John Doe"
                required
              />
              <TextField
                name="name_ar"
                label={t('profilePage.arabicName')}
                placeholder="الاسم بالعربية"
                dir="rtl"
              />
            </div>
            
            <TextField
              name="email"
              label={t('profilePage.email')}
              type="email"
              placeholder="email@example.com"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                name="phone"
                label={t('profilePage.phone')}
                type="tel"
              />
              
              <Controller
                control={form.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <SelectField
                    label={t('profilePage.gender')}
                    options={[
                      { value: 'male', label: t('profilePage.male') },
                      { value: 'female', label: t('profilePage.female') }
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error}
                  />
                )}
              />
            </div>

            <DatePicker
              name="date_of_birth"
              label={t('profilePage.dateOfBirth')}
            />

            <TextField
              name="address"
              label={t('profilePage.address')}
            />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="wilaya"
                render={({ field, fieldState }) => (
                  <SelectField
                    label={t('profilePage.wilaya')}
                    placeholder={t('profilePage.selectWilaya', 'Select Wilaya')}
                    options={wilayas?.map(w => ({
                      value: w.id.toString(),
                      label: isRTL ? (w.name_ar || w.name) : w.name
                    })) || []}
                    value={field.value}
                    onChange={(val) => {
                       field.onChange(val)
                       form.setValue('municipality', undefined)
                       form.setValue('institution_id', undefined)
                    }}
                    error={fieldState.error}
                  />
                )}
              />
              
              <Controller
                control={form.control}
                name="municipality"
                render={({ field, fieldState }) => (
                  <SelectField
                    label={t('profilePage.municipality')}
                    placeholder={t('profilePage.selectMunicipality', 'Select Municipality')}
                    options={municipalities?.map(m => ({
                      value: m.id.toString(),
                      label: isRTL ? (m.name_ar || m.name) : m.name
                    })) || []}
                    value={field.value}
                    onChange={(val) => {
                       field.onChange(val)
                       form.setValue('institution_id', undefined)
                    }}
                    disabled={!selectedWilaya}
                    error={fieldState.error}
                  />
                )}
              />
            </div>
            
             <Controller
                control={form.control}
                name="institution_id"
                render={({ field, fieldState }) => (
                  <SelectField
                    label={t('profilePage.institution')}
                    placeholder={
                       noInstitutionsFound 
                       ? t('auth.register.noInstitutions', 'No institutions found')
                       : t('profilePage.selectInstitution', 'Select Institution')
                    }
                    options={institutions.map(i => ({
                      value: i.id.toString(),
                      label: isRTL ? (i.name_ar || i.name) : i.name
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!selectedMunicipality || noInstitutionsFound}
                    error={fieldState.error}
                  />
                )}
              />

            {/* Admin only fields (if user is admin) */}
            {(user.role === 'admin' || user.role === 'manager' || user.role === 'super_admin') && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                  <TextField 
                    name="work_phone"
                    label={t('profilePage.workPhone')}
                    type="tel"
                  />
                  <TextField 
                    name="office_location"
                    label={t('profilePage.officeLocation')}
                  />
                  <DatePicker 
                    name="date_of_hiring"
                    label={t('profilePage.dateOfHiring')}
                  />
                  <TextField 
                    name="years_of_experience"
                    label={t('profilePage.yearsOfExperience')}
                    type="number"
                  />
               </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <ActionButton
                 type="button"
                 variant="outline"
                 onClick={onClose}
                 disabled={isPending}
              >
                {t('common.cancel')}
              </ActionButton>
              <ActionButton
                 type="submit"
                 isLoading={isPending}
                 disabled={isPending}
              >
                {isPending ? t('common.saving') : t('common.save')}
              </ActionButton>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
