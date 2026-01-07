import { useEffect, useMemo } from 'react'
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
  DialogFooter,
} from '@/components/ui/dialog'


import { Form } from '@/components/ui/form'
import { TextField, SelectField, DatePicker, ActionButton } from '@/components/ui/form-fields'
import { MultiSelectField } from '@/components/ui/form-fields'
import { useWilayas, useMunicipalities, useInstitutionsByLocation } from '@/hooks/use-institutions'
import { useSubjects } from '@/hooks/use-subjects'
import { useUpdateProfile } from '@/hooks/use-profile-mutation'
import { mapSubjectNamesToIds, mapSubjectIdsToNames } from '@/utils/subject-utils'
import type { User } from '@/features/users/types/user.types'
import { createProfileSchema } from '@/schemas/profile-schema'

// Mapped type for form inputs (native date inputs use strings)
export type ProfileFormInputValues = {
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
  subjects?: string[]
}

interface EditProfileDialogProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function EditProfileDialog({ user, isOpen, onClose }: EditProfileDialogProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  // Use mutation hook (handles cache update via invalidation)
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(user.id)

  const profileSchema = useMemo(() => createProfileSchema(t), [t])

  // Use ProfileFormInputValues to allow string dates in defaultValues
  const form = useForm<ProfileFormInputValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      name_ar: user.name_ar || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender || undefined,
      // Format dates for native date input (YYYY-MM-DD)
      date_of_birth: user.date_of_birth ? format(new Date(user.date_of_birth), 'yyyy-MM-dd') : undefined,
      wilaya: user.wilaya?.id ? user.wilaya.id.toString() : '',
      municipality: user.municipality?.id ? user.municipality.id.toString() : '',
      institution_id: user.institution?.id.toString() || '',
      work_phone: user.work_phone || '',
      office_location: user.office_location || '',
      date_of_hiring: user.date_of_hiring ? format(new Date(user.date_of_hiring), 'yyyy-MM-dd') : undefined,
      years_of_experience: user.years_of_experience ?? undefined,
      subjects: user.subjects?.[0] ? [user.subjects[0]] : [], // Initialize as array
    },
  })

  // Watch for cascading selects
  const selectedWilaya = form.watch('wilaya')
  const selectedMunicipality = form.watch('municipality')

  // Fetch data
  const { data: wilayas } = useWilayas()
  const { data: subjectsList } = useSubjects()
  const { data: municipalities } = useMunicipalities(
    selectedWilaya ? parseInt(selectedWilaya) : undefined
  )
  const { data: institutionsData, isLoading: loadingInstitutions } = useInstitutionsByLocation(
    selectedWilaya ? parseInt(selectedWilaya) : undefined,
    selectedMunicipality ? parseInt(selectedMunicipality) : undefined,
    { enabled: !!selectedWilaya && !!selectedMunicipality }
  )

  // Reset form when user, dialog state, or reference data changes
  useEffect(() => {
    if (isOpen && subjectsList && subjectsList.length > 0) {
      // Map user subject names to IDs using utility function (SRP)
      const currentSubjectIds = mapSubjectNamesToIds(subjectsList, user.subjects)

      form.reset({
        name: user.name || '',
        name_ar: user.name_ar || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender || undefined,
        date_of_birth: user.date_of_birth ? format(new Date(user.date_of_birth), 'yyyy-MM-dd') : undefined,
        wilaya: user.wilaya?.id ? user.wilaya.id.toString() : '',
        municipality: user.municipality?.id ? user.municipality.id.toString() : '',
        institution_id: user.institution?.id.toString() || '',
        work_phone: user.work_phone || '',
        office_location: user.office_location || '',
        date_of_hiring: user.date_of_hiring ? format(new Date(user.date_of_hiring), 'yyyy-MM-dd') : undefined,
        years_of_experience: user.years_of_experience ?? undefined,
        subjects: currentSubjectIds,
      })
    }
  }, [user, isOpen, form, subjectsList])

  // ... (existing useEffects)

  const institutions = institutionsData?.data || []
  const hasInstitutions = institutions.length > 0
  const noInstitutionsFound = !!selectedMunicipality && !loadingInstitutions && !hasInstitutions

  const selectedSubjects = form.watch('subjects') || []

  // Subject Selection Logic (Reused from AcademicSection)
  const getSubjectOptions = () => {
    // Helper to find ID by partial name match
    const findIdByName = (namePart: string) =>
      subjectsList?.find(s => s.name.toLowerCase().includes(namePart.toLowerCase()))?.id || -1

    const arabicId = findIdByName('Arabic')
    const historyId = findIdByName('History')
    const civicId = findIdByName('Civic')
    const islamicId = findIdByName('Islamic')

    // Check if selected subjects include these IDs (ensure comparison as strings)
    const hasArabic = selectedSubjects.includes(arabicId.toString())
    const hasHistory = selectedSubjects.includes(historyId.toString())
    const hasCivic = selectedSubjects.includes(civicId.toString())
    const hasIslamic = selectedSubjects.includes(islamicId.toString())

    const count = selectedSubjects.length

    return subjectsList?.map(s => {
      let disabled = false
      const sIdStr = s.id.toString()
      const isSelected = selectedSubjects.includes(sIdStr)

      if (!isSelected) {
        if (count >= 2) {
          disabled = true
        } else if (count === 1) {
          if (hasArabic) disabled = s.id !== islamicId
          else if (hasIslamic) disabled = s.id !== arabicId
          else if (hasHistory) disabled = s.id !== civicId
          else if (hasCivic) disabled = s.id !== historyId
          else disabled = true
        }
      }

      return {
        value: sIdStr,
        label: isRTL ? s.name_ar : s.name,
        disabled
      }
    }) || []
  }

  // Submit handler - mutation handles cache update
  const onSubmit = async (values: ProfileFormInputValues) => {
    try {
      // Convert subject IDs to subject names for backend using utility function (SRP)
      const subjectNames = mapSubjectIdsToNames(subjectsList || [], values.subjects, isRTL)

      const profileValues = {
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth : undefined,
        date_of_hiring: values.date_of_hiring ? values.date_of_hiring : undefined,
        years_of_experience: values.years_of_experience ? Number(values.years_of_experience) : undefined,
        wilaya: values.wilaya || undefined,
        municipality: values.municipality || undefined,
        subjects: subjectNames,
      }
      await updateProfile(profileValues)
      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('profilePage.editProfile', 'Edit Profile')}</DialogTitle>
          <DialogDescription>
            {t('profilePage.editProfileDesc', 'Update your personal information.')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
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

              {/* Teacher specific fields */}
              {user.role === 'teacher' && (
                <div className="grid grid-cols-1 gap-4 border-t pt-4 mt-4">
                  <Controller
                    control={form.control}
                    name="subjects"
                    render={({ field, fieldState }) => (
                      <MultiSelectField
                        label={t('profilePage.subject', 'Subject')}
                        placeholder={t('profilePage.selectSubject', 'Select Subject')}
                        options={getSubjectOptions()}
                        value={field.value || []}
                        onChange={field.onChange}
                        error={fieldState.error}
                        maxSelected={2}
                      />
                    )}
                  />
                </div>
              )}

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

            </div>
            {/* End of scrollable area */}

            <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t mt-4">
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
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
