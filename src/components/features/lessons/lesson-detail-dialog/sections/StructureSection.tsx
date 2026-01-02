import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LessonDetailFormData } from '../dialog-config.ts'
import type { TFunction } from 'i18next'

interface StructureSectionProps {
    t: TFunction
    formData: LessonDetailFormData
    updateFormField: (field: keyof LessonDetailFormData, value: unknown) => void
}

/**
 * Single Responsibility: Lesson structure fields
 */
export function StructureSection({ t, formData, updateFormField }: StructureSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                {t('pages.prep.sections.structure')}
            </h3>

            <div className="grid gap-2">
                <Label htmlFor="field">{t('pages.prep.lessonStructure.field')}</Label>
                <Input
                    id="field"
                    value={formData.field}
                    onChange={(e) => updateFormField('field', e.target.value)}
                    placeholder={t('pages.prep.lessonStructure.fieldPlaceholder')}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="learningSegment">
                    {t('pages.prep.lessonStructure.learningSegment')}
                </Label>
                <Input
                    id="learningSegment"
                    value={formData.learningSegment}
                    onChange={(e) => updateFormField('learningSegment', e.target.value)}
                    placeholder={t('pages.prep.lessonStructure.learningSegmentPlaceholder')}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="knowledgeResource">
                    {t('pages.prep.lessonStructure.knowledgeResource')}
                </Label>
                <Input
                    id="knowledgeResource"
                    value={formData.knowledgeResource}
                    placeholder={t('pages.prep.lessonStructure.knowledgeResourcePlaceholder')}
                    onChange={(e) => updateFormField('knowledgeResource', e.target.value)}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="targetedKnowledge">
                    {t('pages.prep.targetedKnowledge', 'Targeted Knowledge')}
                </Label>
                <Textarea
                    id="targetedKnowledge"
                    value={formData.targetedKnowledge}
                    onChange={(e) => updateFormField('targetedKnowledge', e.target.value)}
                    placeholder={t('pages.prep.targetedKnowledgePlaceholder', 'One item per line')}
                    rows={3}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="usedMaterials">
                    {t('pages.prep.usedMaterials', 'Used Materials')}
                </Label>
                <Textarea
                    id="usedMaterials"
                    value={formData.usedMaterials}
                    onChange={(e) => updateFormField('usedMaterials', e.target.value)}
                    placeholder={t('pages.prep.materialsPlaceholder', 'Comma separated')}
                    rows={2}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="references">{t('pages.prep.references', 'References')}</Label>
                <Textarea
                    id="references"
                    value={formData.references}
                    onChange={(e) => updateFormField('references', e.target.value)}
                    placeholder={t('pages.prep.referencesPlaceholder', 'One item per line')}
                    rows={2}
                />
            </div>
        </div>
    )
}
