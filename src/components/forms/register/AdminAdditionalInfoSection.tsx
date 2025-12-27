import { useTranslation } from "react-i18next"
import { TextField, TextAreaField } from "../TextField"
import { SelectField } from "../SelectField"
import { DatePicker } from "../DatePicker"
import { useSupervisors } from "@/hooks/use-supervisors"
import { useFormContext } from "react-hook-form"

interface AdminAdditionalInfoSectionProps {
  // Props if needed in future
}

export function AdminAdditionalInfoSection({}: AdminAdditionalInfoSectionProps) {
  const { t } = useTranslation()
  const { watch, setValue, formState: { errors } } = useFormContext()
  const supervisorId = watch('supervisorId')

  const { data: supervisors = [], isLoading: loadingSupervisors } = useSupervisors()

  const supervisorOptions = supervisors.map(s => ({
    value: s.id,
    label: `${s.name} - ${s.position}`
  }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employee ID */}
        <TextField
          name="employeeId"
          label={t('auth.register.employeeId')}
          placeholder={t('auth.register.employeeIdPlaceholder')}
          required
        />

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
        
        {/* Supervisor */}
        <SelectField
          label={t('auth.register.supervisor')}
          options={supervisorOptions}
          value={supervisorId}
          onChange={(val) => setValue('supervisorId', val)}
          placeholder={loadingSupervisors ? t('common.loading') : t('auth.register.selectSupervisor')}
          error={errors.supervisorId as any}
          className="w-full"
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
