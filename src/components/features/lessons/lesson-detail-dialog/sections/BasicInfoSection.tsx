import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { LessonDetailFormData } from './dialog-config.ts'
import type { TFunction } from 'i18next'

interface BasicInfoSectionProps {
    t: TFunction
    formData: LessonDetailFormData
    updateFormField: <K extends keyof LessonDetailFormData>(
        field: K,
        value: LessonDetailFormData[K]
    ) => void
}

/**
 * Single Responsibility: Basic lesson information fields
 */
export function BasicInfoSection({ t, formData, updateFormField }: BasicInfoSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                {t('pages.prep.sections.basicInfo')}
            </h3>

            <div className="grid gap-2">
                <Label htmlFor="class">{t('pages.prep.class')}</Label>
                <Input
                    id="class"
                    value={formData.class}
                    readOnly
                    disabled
                    className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                    {t('pages.prep.classFromTimetable')}
                </p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="date">{t('pages.prep.date')} *</Label>
                <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormField('date', e.target.value)}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="lessonNumber">{t('pages.prep.lessonNumber')} *</Label>
                <Input
                    id="lessonNumber"
                    type="number"
                    value={formData.lessonNumber}
                    onChange={(e) => updateFormField('lessonNumber', e.target.value)}
                    placeholder={t('pages.prep.lessonNumberPlaceholder')}
                    min="1"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status">{t('pages.prep.status.label')}</Label>
                <Select
                    value={formData.status || 'none'}
                    onValueChange={(value) => {
                        updateFormField(
                            'status',
                            value === 'none'
                                ? undefined
                                : (value as 'completed' | 'postponed' | 'deleted')
                        )
                        if (value === 'none') {
                            updateFormField('statusNote', '')
                        }
                    }}
                >
                    <SelectTrigger id="status">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">{t('pages.prep.status.none')}</SelectItem>
                        <SelectItem value="completed">{t('pages.prep.status.completed')}</SelectItem>
                        <SelectItem value="postponed">{t('pages.prep.status.postponed')}</SelectItem>
                        <SelectItem value="deleted">{t('pages.prep.status.deleted')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {(formData.status === 'postponed' || formData.status === 'deleted') && (
                <div className="grid gap-2">
                    <Label htmlFor="statusNote">
                        {formData.status === 'postponed'
                            ? t('pages.prep.status.postponedReason')
                            : t('pages.prep.status.deletedReason')}
                    </Label>
                    <Textarea
                        id="statusNote"
                        value={formData.statusNote}
                        onChange={(e) => updateFormField('statusNote', e.target.value)}
                        placeholder={
                            formData.status === 'postponed'
                                ? t('pages.prep.status.postponedPlaceholder')
                                : t('pages.prep.status.deletedPlaceholder')
                        }
                        rows={2}
                    />
                </div>
            )}
        </div>
    )
}
