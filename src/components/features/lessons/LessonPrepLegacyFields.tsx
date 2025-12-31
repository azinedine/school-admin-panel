import { type Control, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X, Target, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { cn } from '@/lib/utils'

interface LessonPrepLegacyFieldsProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
    variant?: 'default' | 'compact'
}

export function LessonPrepLegacyFields({
    control,
    isLoading,
    language,
    variant = 'default'
}: LessonPrepLegacyFieldsProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT
    const isCompact = variant === 'compact'

    const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = useFieldArray({
        control,
        name: 'learning_objectives',
    })

    const { fields: methodFields, append: appendMethod, remove: removeMethod } = useFieldArray({
        control,
        name: 'teaching_methods',
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
        <div className={cn("space-y-2", isCompact ? "bg-background/50 rounded-md border border-dashed p-3" : "")}>
            <div className="flex items-center justify-between">
                <h3 className={cn("font-medium flex items-center gap-2 text-muted-foreground", isCompact ? "text-xs uppercase tracking-wide" : "text-sm")}>
                    <Icon className={cn(isCompact ? "h-3 w-3" : "h-4 w-4")} />
                    {title}
                </h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ value: '' })}
                    disabled={isLoading}
                    className={cn(colorClass, isCompact ? "h-6 w-6 p-0" : "")}
                >
                    <Plus className={cn("h-4 w-4", isCompact ? "" : "mr-2")} />
                    {!isCompact && t('common.add', 'Add')}
                </Button>
            </div>

            {fields.length === 0 && !isCompact && (
                <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
                    {emptyMsg}
                </div>
            )}

            {fields.length === 0 && isCompact && (
                <div className="text-[10px] text-muted-foreground italic pl-6 opacity-60">
                    {t('common.none', 'None')}
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
                                            className={cn(isCompact ? "h-7 text-xs bg-muted/50 focus:bg-background transition-colors" : "")}
                                        />
                                    </FormControl>
                                    <FormMessage className={cn(isCompact ? "text-[10px] mt-0" : "")} />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={isLoading}
                            className={cn("text-muted-foreground hover:text-destructive", isCompact ? "h-7 w-7" : "")}
                        >
                            <X className={cn(isCompact ? "h-3 w-3" : "h-4 w-4")} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )

    if (isCompact) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFieldList(
                    t('pages.prep.learningObjectives', 'Objectives'),
                    Target,
                    objectiveFields,
                    appendObjective,
                    removeObjective,
                    'learning_objectives',
                    t('pages.prep.objectivePlaceholder', 'Objective...'),
                    t('pages.prep.noObjectives'),
                    "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                )}
                {renderFieldList(
                    t('pages.prep.teachingMethods', 'Methods'),
                    Users,
                    methodFields,
                    appendMethod,
                    removeMethod,
                    'teaching_methods',
                    t('pages.prep.methodPlaceholder', 'Method...'),
                    t('pages.prep.noMethods'),
                    "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                )}
            </div>
        )
    }

    // Default Card Layout
    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.objectivesAndTopics', 'Objectives & Topics')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {renderFieldList(
                    t('pages.prep.learningObjectives', 'Learning Objectives'),
                    Target,
                    objectiveFields,
                    appendObjective,
                    removeObjective,
                    'learning_objectives',
                    t('pages.prep.objectivePlaceholder', 'Enter objective...'),
                    t('pages.prep.noObjectives', 'No objectives added'),
                    "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                )}

                <div className="h-px bg-border/50" />

                {renderFieldList(
                    t('pages.prep.teachingMethods', 'Teaching Methods'),
                    Users,
                    methodFields,
                    appendMethod,
                    removeMethod,
                    'teaching_methods',
                    t('pages.prep.methodPlaceholder', 'Enter method...'),
                    t('pages.prep.noMethods', 'No methods added'),
                    "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                )}
            </CardContent>
        </Card>
    )
}
