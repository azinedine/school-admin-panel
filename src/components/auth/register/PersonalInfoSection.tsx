import { useFormContext, type FieldError } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TextField } from "../../forms/TextField"
import { DatePicker } from "../../forms/DatePicker"
import { SelectField } from "../../forms/SelectField"

export function PersonalInfoSection() {
  const { t } = useTranslation()
  const { setValue, watch, formState: { errors } } = useFormContext()
  const gender = watch('gender')

  const genderOptions = [
    { value: 'male', label: t('profilePage.male') },
    { value: 'female', label: t('profilePage.female') },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <TextField
        name="name_ar"
        label={t('profilePage.arabicName')}
        placeholder={t('auth.register.nameArPlaceholder')}
        dir="rtl"
      />

      <SelectField
        label={t('profilePage.gender')}
        value={gender}
        onChange={(val) => setValue('gender', val)}
        options={genderOptions}
        placeholder={t('auth.register.selectGender')}
        error={errors.gender as FieldError | undefined}
      />

      <DatePicker
        name="date_of_birth"
        label={t('profilePage.dateOfBirth')}
      />
    </div>
  )
}
