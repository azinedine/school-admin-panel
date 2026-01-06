import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LessonDetailFormData } from '../dialog-config.ts'
import type { TFunction } from 'i18next'

interface ElementsSectionProps {
    t: TFunction
    formData: LessonDetailFormData
    updateFormField: (field: keyof LessonDetailFormData, value: unknown) => void
    addLessonElement: () => void
    updateLessonElement: (index: number, value: string) => void
    removeLessonElement: (index: number) => void
}

/**
 * Single Responsibility: Lesson elements and content/evaluation
 */
export function ElementsSection({
    t,
    formData,
    updateFormField,
    addLessonElement,
    updateLessonElement,
    removeLessonElement,
}: ElementsSectionProps) {
    return (
        <>
            {/* Lesson Elements */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                    {t('pages.prep.sections.elements')}
                </h3>

                {formData.lessonElements.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                        {t('pages.prep.lessonElements.noElements')}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {formData.lessonElements.map((element, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {t('pages.prep.lessonElements.elementNumber', {
                                                number: index + 1,
                                            })}
                                        </span>
                                    </div>
                                    <Input
                                        value={element}
                                        onChange={(e) => updateLessonElement(index, e.target.value)}
                                        placeholder={t('pages.prep.lessonElements.elementPlaceholder')}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLessonElement(index)}
                                    className="mt-6"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLessonElement}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('pages.prep.lessonElements.addElement')}
                </Button>
            </div>

            {/* Content & Evaluation */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                    {t('pages.prep.sections.contentEvaluation')}
                </h3>

                <div className="grid gap-2">
                    <Label htmlFor="lessonContent">{t('pages.prep.lessonContent')}</Label>
                    <Textarea
                        id="lessonContent"
                        value={formData.lessonContent}
                        onChange={(e) => updateFormField('lessonContent', e.target.value)}
                        placeholder={t('pages.prep.lessonContent')}
                        rows={4}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="assessment">{t('pages.prep.assessment')}</Label>
                    <Textarea
                        id="assessment"
                        value={formData.assessment}
                        onChange={(e) => updateFormField('assessment', e.target.value)}
                        placeholder={t('pages.prep.assessmentPlaceholder')}
                        rows={3}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="practiceNotes">{t('pages.prep.practiceNotes')}</Label>
                    <Textarea
                        id="practiceNotes"
                        value={formData.practiceNotes}
                        onChange={(e) => updateFormField('practiceNotes', e.target.value)}
                        placeholder={t('pages.prep.practiceNotes')}
                        rows={3}
                    />
                </div>
            </div>
        </>
    )
}
