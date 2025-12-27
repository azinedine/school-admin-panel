import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { SelectField } from "@/components/forms/SelectField" 
// Hooks
import { useWilayas, useMunicipalities, useInstitutions } from "@/hooks/use-institutions"

export function LocationSection() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { watch, setValue, formState: { errors } } = useFormContext()

  const selectedWilaya = watch('wilaya')
  const selectedMunicipality = watch('municipality')

  // Data Fetching
  const { data: wilayas, isLoading: loadingWilayas } = useWilayas()
  const { data: municipalities, isLoading: loadingMunicipalities } = useMunicipalities(
    selectedWilaya ? parseInt(selectedWilaya) : undefined
  )
  const { data: institutionsData, isLoading: loadingInstitutions } = useInstitutions(
    selectedMunicipality ? { municipality_id: parseInt(selectedMunicipality), is_active: true } : {}
  )
  const institutions = institutionsData?.data || []

  // Transform data for SelectField
  const wilayaOptions = wilayas?.map(w => ({
    value: w.code,
    label: isRTL ? (w.name_ar || w.name) : w.name
  })) || []

  const municipalityOptions = municipalities?.map(m => ({
    value: m.id.toString(),
    label: isRTL ? (m.name_ar || m.name) : m.name
  })) || []

  const institutionOptions = institutions.map(i => ({
    value: i.id.toString(),
    label: isRTL ? (i.name_ar || i.name) : i.name
  })) 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <SelectField
        label={t('auth.register.wilaya')}
        placeholder={t('auth.register.selectWilaya')}
        options={wilayaOptions}
        value={selectedWilaya}
        onChange={(val) => {
            setValue('wilaya', val)
            setValue('municipality', '') // Reset dependents
            setValue('institution', '') 
        }}
        isLoading={loadingWilayas}
        error={errors.wilaya as any}
        required
      />

      <SelectField
        label={t('auth.register.municipality')}
        placeholder={t('auth.register.selectMunicipality')}
        options={municipalityOptions}
        value={selectedMunicipality}
        onChange={(val) => {
            setValue('municipality', val)
            setValue('institution', '') // Reset dependent
        }}
        isLoading={loadingMunicipalities}
        disabled={!selectedWilaya}
        error={errors.municipality as any}
        required
      />

      <SelectField
         label={t('auth.register.institution')}
         placeholder={t('auth.register.selectInstitution')}
         options={institutionOptions}
         value={watch('institution')}
         onChange={(val) => setValue('institution', val)}
         isLoading={loadingInstitutions}
         disabled={!selectedMunicipality}
         error={errors.institution as any}
         required
         className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  )
}
