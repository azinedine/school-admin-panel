import { type Control, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X, Target, Lightbulb, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface LessonPrepLegacyFieldsProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepLegacyFields({
    control,
    isLoading,
    language,
}: LessonPrepLegacyFieldsProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = useFieldArray({
        control,
        name: 'learning_objectives',
    })

    const { fields: topicFields, append: appendTopic, remove: removeTopic } = useFieldArray({
        control,
        name: 'key_topics',
    })

    const { fields: methodFields, append: appendMethod, remove: removeMethod } = useFieldArray({
        control,
        name: 'teaching_methods',
    })

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
                {/* Learning Objectives */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {t('pages.prep.learningObjectives', 'Learning Objectives')}
                        </h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => appendObjective({ value: '' })}
                            disabled={isLoading}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('common.add', 'Add')}
                        </Button>
                    </div>

                    {objectiveFields.length === 0 && (
                        <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
                            {t('pages.prep.noObjectives', 'No objectives added')}
                        </div>
                    )}

                    <div className="space-y-2">
                        {objectiveFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <FormField
                                    control={control}
                                    name={`learning_objectives.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={t('pages.prep.objectivePlaceholder', 'Enter objective...')}
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
                                    onClick={() => removeObjective(index)}
                                    disabled={isLoading}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Key Topics */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            {t('pages.prep.keyTopics', 'Key Topics')}
                        </h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => appendTopic({ value: '' })}
                            disabled={isLoading}
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('common.add', 'Add')}
                        </Button>
                    </div>

                    {topicFields.length === 0 && (
                        <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
                            {t('pages.prep.noTopics', 'No topics added')}
                        </div>
                    )}

                    <div className="space-y-2">
                        {topicFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <FormField
                                    control={control}
                                    name={`key_topics.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={t('pages.prep.topicPlaceholder', 'Enter topic...')}
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
                                    onClick={() => removeTopic(index)}
                                    disabled={isLoading}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Teaching Methods */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t('pages.prep.teachingMethods', 'Teaching Methods')}
                        </h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => appendMethod({ value: '' })}
                            disabled={isLoading}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t('common.add', 'Add')}
                        </Button>
                    </div>

                    {methodFields.length === 0 && (
                        <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
                            {t('pages.prep.noMethods', 'No methods added')}
                        </div>
                    )}

                    {/* Show error for the array itself if empty and required */}
                    <div className="space-y-2">
                        <FormField
                            control={control}
                            name="teaching_methods"
                            render={() => (
                                <FormItem>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        {methodFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <FormField
                                    control={control}
                                    name={`teaching_methods.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={t('pages.prep.methodPlaceholder', 'Enter method...')}
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
                                    onClick={() => removeMethod(index)}
                                    disabled={isLoading}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
