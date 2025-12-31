import { type Control, useFieldArray, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X, Target, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { useMaterials } from '@/hooks/use-materials'
import { useReferences } from '@/hooks/use-references'
import { MultiSelectField } from '@/components/forms/MultiSelectField'

interface LessonSupportMaterialProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonSupportMaterial({
    control,
    isLoading,
    language,
}: LessonSupportMaterialProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isRTL = i18n.language === 'ar'

    // Fetch materials from API
    const { data: materialsList = [], isLoading: loadingMaterials } = useMaterials()

    // Transform materials to options for MultiSelect
    // Use English name as value to ensure persistence across language changes
    const materialOptions = materialsList.map(m => ({
        value: m.name,
        label: isRTL ? m.name_ar : m.name,
    }))

    // Fetch references from API
    const { data: referencesList = [], isLoading: loadingReferences } = useReferences()

    // Transform references to options for MultiSelect
    // Use English name as value to ensure persistence across language changes
    const referenceOptions = referencesList.map(r => ({
        value: r.name,
        label: isRTL ? r.name_ar : r.name,
    }))

    const { fields: knowledgeFields, append: appendKnowledge, remove: removeKnowledge } = useFieldArray({
        control,
        name: 'targeted_knowledge',
    })

    const renderFieldList = (
        title: string,
        Icon: React.ElementType,
        fields: any[],
        append: (val: any) => void,
        remove: (index: number) => void,
        namePrefix: string,
        placeholder: string,
        emptyMsg: string,
        colorClass: string
    ) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    {title}
                </h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ value: '' })}
                    disabled={isLoading}
                    className={colorClass}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('common.add', 'Add')}
                </Button>
            </div>

            {fields.length === 0 && (
                <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
                    {emptyMsg}
                </div>
            )}

            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                        <FormField
                            control={control}
                            name={`${namePrefix}.${index}.value` as any}
                            render={({ field }) => (
                                <FormItem className="flex-1 space-y-0">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={placeholder}
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
                            onClick={() => remove(index)}
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

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Layers className="h-5 w-5 text-purple-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.supportMaterial', 'Support Material')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Used Materials - MultiSelect Dropdown */}
                <div className="space-y-2">
                    <Controller
                        control={control}
                        name="used_materials"
                        render={({ field }) => (
                            <MultiSelectField
                                label={t('pages.prep.usedMaterials', 'Used Materials')}
                                placeholder={t('pages.prep.selectMaterials', 'Select materials...')}
                                options={materialOptions}
                                value={field.value || []}
                                onChange={field.onChange}
                                disabled={isLoading || loadingMaterials}
                            />
                        )}
                    />
                </div>

                <div className="h-px bg-border/50" />

                {/* References - MultiSelect Dropdown */}
                <div className="space-y-2">
                    <Controller
                        control={control}
                        name="references"
                        render={({ field }) => (
                            <MultiSelectField
                                label={t('pages.prep.references', 'References')}
                                placeholder={t('pages.prep.selectReferences', 'Select references...')}
                                options={referenceOptions}
                                value={field.value || []}
                                onChange={field.onChange}
                                disabled={isLoading || loadingReferences}
                            />
                        )}
                    />
                </div>

                <div className="h-px bg-border/50" />

                {renderFieldList(
                    t('pages.prep.targetedKnowledge', 'Targeted Knowledge'),
                    Target,
                    knowledgeFields,
                    appendKnowledge,
                    removeKnowledge,
                    'targeted_knowledge',
                    t('pages.prep.knowledgePlaceholder', 'Enter knowledge point...'),
                    t('pages.prep.noKnowledge', 'No targeted knowledge added'),
                    "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                )}
            </CardContent>
        </Card>
    )
}
