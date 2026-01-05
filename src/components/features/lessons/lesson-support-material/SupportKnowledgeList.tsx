import { type Control, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface SupportKnowledgeListProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function SupportKnowledgeList({
    control,
    isLoading,
    language,
}: SupportKnowledgeListProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const {
        fields: knowledgeFields,
        append: appendKnowledge,
        remove: removeKnowledge,
    } = useFieldArray({
        control,
        name: 'targeted_knowledge',
    })

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    {t('pages.prep.targetedKnowledge', 'Targeted Knowledge')}
                </h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => appendKnowledge({ value: '' })}
                    disabled={isLoading}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('common.add', 'Add')}
                </Button>
            </div>

            {knowledgeFields.length === 0 && (
                <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
                    {t('pages.prep.noKnowledge', 'No targeted knowledge added')}
                </div>
            )}

            <div className="space-y-2">
                {knowledgeFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                        <FormField
                            control={control}
                            name={`targeted_knowledge.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="flex-1 space-y-0">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={t(
                                                'pages.prep.knowledgePlaceholder',
                                                'Enter knowledge point...'
                                            )}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKnowledge(index)}
                            disabled={isLoading}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
