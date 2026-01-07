import { useTranslation } from "react-i18next"
import { TextField, TextAreaField } from "../../forms/TextField"
import { DatePicker } from "../../forms/DatePicker"


export function AdminAdditionalInfoSection() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Department / Unit */}
        <TextField
          name="department"
          label={t('auth.register.department')}
          placeholder={t('auth.register.departmentPlaceholder')}
          required
        />

        {/* Position / Job Title */}
        <TextField
          name="position"
          label={t('auth.register.position')}
          placeholder={t('auth.register.positionPlaceholder')}
          required
        />

        {/* Date of Hiring */}
        <DatePicker
          name="dateOfHiring"
          label={t('auth.register.dateOfHiring')}
          placeholder={t('auth.register.dateOfHiringPlaceholder')}
          required
        />

        {/* Work Phone */}
        <TextField
          name="workPhone"
          label={t('auth.register.workPhone')}
          placeholder={t('auth.register.workPhonePlaceholder')}
          required
        />

        {/* Office Location */}
        <TextField
          name="officeLocation"
          label={t('auth.register.officeLocation')}
          placeholder={t('auth.register.officeLocationPlaceholder')}
          required
        />
      </div>

      {/* Notes / Remarks - Full Width */}
      <TextAreaField
        name="notes"
        label={t('auth.register.notes')}
        placeholder={t('auth.register.notesPlaceholder')}
        rows={3}
      />
    </div>
  )
}
