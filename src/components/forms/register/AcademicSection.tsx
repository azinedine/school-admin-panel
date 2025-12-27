import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { subjectsList, classesList } from "@/data/mock-locations"
import { TextField } from "../TextField"
import { SelectField } from "../SelectField"

interface AcademicSectionProps {
  role: 'teacher' | 'student' | 'parent' | 'admin'
}

export function AcademicSection({ role }: AcademicSectionProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { setValue, watch, formState: { errors } } = useFormContext()
  const selectedSubjects = watch('subjects')
  const selectedLevels = watch('levels')
  const selectedClass = watch('class')

  const toggleSubject = (subjectId: string) => {
    const current = selectedSubjects || []
    if (current.includes(subjectId)) {
      setValue('subjects', current.filter((id: string) => id !== subjectId))
    } else {
      setValue('subjects', [...current, subjectId])
    }
  }

  const toggleLevel = (levelId: string) => {
    const current = selectedLevels || []
    if (current.includes(levelId)) {
      setValue('levels', current.filter((id: string) => id !== levelId))
    } else {
      setValue('levels', [...current, levelId])
    }
  }

  const classOptions = classesList.map(c => ({
    value: c.id,
    label: c.name
  }))

  if (role === 'teacher') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('auth.register.subjects')}</Label>
          <div className="border rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2 bg-background/50">
            {subjectsList.map(s => (
              <div key={s.id} className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded transition-colors">
                <Checkbox 
                  id={`subject-${s.id}`} 
                  checked={(selectedSubjects || []).includes(s.id)}
                  onCheckedChange={() => toggleSubject(s.id)}
                />
                <Label 
                  htmlFor={`subject-${s.id}`} 
                  className="text-xs font-normal cursor-pointer flex-1"
                >
                  {isRTL ? s.nameAr : s.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('auth.register.levels')}</Label>
          <div className="border rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-3 gap-2 bg-background/50">
            {classesList.map(l => (
              <div key={l.id} className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded transition-colors">
                <Checkbox 
                  id={`level-${l.id}`} 
                  checked={(selectedLevels || []).includes(l.id)}
                  onCheckedChange={() => toggleLevel(l.id)}
                />
                <Label 
                  htmlFor={`level-${l.id}`} 
                  className="text-xs font-normal cursor-pointer flex-1"
                >
                  {l.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (role === 'student') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SelectField
            label={t('auth.register.class')}
            value={selectedClass}
            onChange={(val) => setValue('class', val)}
            options={classOptions}
            placeholder={t('auth.register.selectClass')}
            error={errors.class as any}
        />
      </div>
    )
  }

  if (role === 'parent') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          name="linkedStudentId"
          label={t('auth.register.linkedStudent')}
          placeholder="Student ID"
        />
      </div>
    )
  }

  return null
}
