import { useFormContext, type FieldError } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TextField } from "@/components/ui/form-fields"
import { SelectField } from "@/components/ui/form-fields"
import { MultiSelectField } from "@/components/ui/form-fields"
import { useSubjects, useLevels } from "@/hooks/use-subjects"

interface AcademicSectionProps {
  role: 'teacher' | 'student' | 'parent' | 'admin'
}

export function AcademicSection({ role }: AcademicSectionProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { setValue, watch, formState: { errors } } = useFormContext()

  const selectedSubjects: string[] = watch('subjects') || []
  const selectedLevels: string[] = watch('levels') || []
  const selectedClass = watch('class')

  // Dynamic data loading
  const { data: subjectsList = [], isLoading: loadingSubjects } = useSubjects()
  const { data: levelsList = [], isLoading: loadingLevels } = useLevels()

  const classOptions = levelsList.map(c => ({
    value: c.id.toString(),
    label: c.name
  }))

  // Subject Selection Logic
  const getSubjectOptions = () => {
    // Helper to find ID by partial name match (robust to casing/slight changes)
    const findIdByName = (namePart: string) =>
      subjectsList.find(s => s.name.toLowerCase().includes(namePart.toLowerCase()))?.id || -1

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

    return subjectsList.map(s => {
      let disabled = false
      const sIdStr = s.id.toString()
      const isSelected = selectedSubjects.includes(sIdStr)

      if (!isSelected) {
        if (count >= 2) {
          disabled = true // Max 2 reached
        } else if (count === 1) {
          // Strict Pairs Logic
          if (hasArabic) {
            disabled = s.id !== islamicId
          } else if (hasIslamic) {
            disabled = s.id !== arabicId
          } else if (hasHistory) {
            disabled = s.id !== civicId
          } else if (hasCivic) {
            disabled = s.id !== historyId
          } else {
            // Any other subject (Math, Science etc) allows NO other subject
            disabled = true
          }
        }
      }

      return {
        value: sIdStr,
        label: isRTL ? s.name_ar : s.name,
        disabled
      }
    })
  }

  const levelOptions = levelsList.map(l => ({
    value: l.id.toString(),
    label: l.name
  }))

  if (role === 'teacher') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MultiSelectField
          label={t('auth.register.subjects')}
          placeholder={t('auth.register.subjects')}
          options={getSubjectOptions()}
          value={selectedSubjects}
          onChange={(val) => setValue('subjects', val)}
          error={errors.subjects as FieldError}
          maxSelected={2}
          className="w-full"
          disabled={loadingSubjects}
        />

        <MultiSelectField
          label={t('auth.register.levels')}
          placeholder={t('auth.register.levels')}
          options={levelOptions}
          value={selectedLevels}
          onChange={(val) => setValue('levels', val)}
          error={errors.levels}
          className="w-full"
          disabled={loadingLevels}
        />
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
          error={errors.class as FieldError}
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
          placeholder={t('auth.register.studentIdPlaceholder')}
        />
      </div>
    )
  }

  return null
}
