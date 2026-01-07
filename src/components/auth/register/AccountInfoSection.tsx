import { useFormContext, type FieldError } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TextField } from "../../forms/TextField"
import { PasswordField } from "../../forms/PasswordField"
import { SelectField } from "../../forms/SelectField"

export function AccountInfoSection() {
  const { t } = useTranslation()
  const { watch, setValue, formState: { errors } } = useFormContext()
  const role = watch('role')

  const roleOptions = [
    { value: 'admin', label: t('auth.roles.admin') },
    { value: 'teacher', label: t('auth.roles.teacher') },
    { value: 'student', label: t('auth.roles.student') },
    { value: 'parent', label: t('auth.roles.parent') },
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          name="name"
          label={t('auth.register.name')}
          placeholder={t('auth.register.name')}
          required
        />
        <TextField
          name="email"
          label={t('auth.login.email')}
          placeholder={t('auth.register.emailPlaceholder')}
          type="email"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PasswordField
          name="password"
          label={t('auth.login.password')}
          placeholder={t('auth.register.passwordPlaceholder')}
          required
        />

        <SelectField
          label={t('auth.register.role')}
          value={role}
          onChange={(val) => setValue('role', val)}
          options={roleOptions}
          placeholder={t('auth.register.selectRole')}
          error={errors.role as FieldError}
          required
        />
      </div>
    </>
  )
}
