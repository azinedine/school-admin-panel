import { useFormContext, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TextField } from "../TextField"
import { DatePicker } from "../DatePicker"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PersonalInfoSection() {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <TextField
        name="name_ar"
        label={t('profilePage.arabicName')}
        placeholder={t('auth.register.nameArPlaceholder', 'أدخل الاسم بالعربية')}
        dir="rtl"
      />
      
      <div className="space-y-1.5">
        <Label>{t('profilePage.gender')}</Label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select value={field.value || ''} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('auth.register.selectGender', 'Select gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('profilePage.male')}</SelectItem>
                <SelectItem value="female">{t('profilePage.female')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <DatePicker
        name="date_of_birth"
        label={t('profilePage.dateOfBirth')}
      />
    </div>
  )
}
