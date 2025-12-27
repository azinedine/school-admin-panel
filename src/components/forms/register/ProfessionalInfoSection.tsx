import { useTranslation } from "react-i18next"
import { TextField } from "../TextField"

export function ProfessionalInfoSection() {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <TextField
        name="phone"
        label={t('profilePage.phone')}
        type="tel"
        placeholder="+213 XXX XXX XXX"
      />
      
      <TextField
        name="teacher_id"
        label={t('profilePage.teacherId')}
        placeholder="T-12345"
      />

      <TextField
        name="years_of_experience"
        label={t('profilePage.experience')}
        type="number"
        min={0}
        placeholder="0"
      />
    </div>
  )
}
