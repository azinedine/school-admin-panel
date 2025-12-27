import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller } from "react-hook-form"
import { subjectsList, classesList } from "@/data/mock-locations"
import { TextField } from "../TextField"

interface AcademicSectionProps {
  role: 'teacher' | 'student' | 'parent' | 'admin'
}

export function AcademicSection({ role }: AcademicSectionProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { control, setValue, watch } = useFormContext()
  const selectedSubjects = watch('subjects')
  const selectedLevels = watch('levels')

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

  if (role === 'teacher') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{t('auth.register.subjects')}</Label>
          <div className="border rounded-md p-2 max-h-32 overflow-y-auto grid grid-cols-2 gap-1">
            {subjectsList.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <Checkbox 
                  id={`subject-${s.id}`} 
                  checked={(selectedSubjects || []).includes(s.id)}
                  onCheckedChange={() => toggleSubject(s.id)}
                />
                <Label 
                  htmlFor={`subject-${s.id}`} 
                  className="text-xs font-normal cursor-pointer"
                >
                  {isRTL ? s.nameAr : s.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>{t('auth.register.levels')}</Label>
          <div className="border rounded-md p-2 max-h-32 overflow-y-auto grid grid-cols-4 gap-1">
            {classesList.map(l => (
              <div key={l.id} className="flex items-center gap-1">
                <Checkbox 
                  id={`level-${l.id}`} 
                  checked={(selectedLevels || []).includes(l.id)}
                  onCheckedChange={() => toggleLevel(l.id)}
                />
                <Label 
                  htmlFor={`level-${l.id}`} 
                  className="text-xs font-normal cursor-pointer"
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
        <div className="space-y-1.5">
          <Label>{t('auth.register.class')}</Label>
          <Controller
            name="class"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('auth.register.selectClass')} />
                </SelectTrigger>
                <SelectContent>
                  {classesList.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
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
