import { type Control, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X, List, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface LessonPrepElementsProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepElements({
    control,
    isLoading,
    language,
}: LessonPrepElementsProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'lesson_elements',
    })

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <List className="h-5 w-5 text-emerald-600" />
                        </div>
                        <CardTitle className="text-lg">
                            {t('pages.prep.lessonElements.title', 'Lesson Elements')}
                        </CardTitle>
                    </div>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => append({ content: '' })}
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('pages.prep.lessonElements.addElement', 'Add Element')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {fields.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                        <div className="p-3 bg-muted rounded-full mb-3">
                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium mb-1">
                            {t('pages.prep.lessonElements.noElements', 'No elements yet')}
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                            Add your first lesson element to get started
                        </p>
                    </div>
                )}

                {fields.map((field, index) => (
                    <div key={field.id} className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <FormField
                            control={control}
                            name={`lesson_elements.${index}.content`}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex gap-4 items-start">
                                        <Badge variant="outline" className="mt-2 h-6 w-6 flex items-center justify-center rounded-full shrink-0 border-primary/20 bg-primary/5 text-primary">
                                            {index + 1}
                                        </Badge>
                                        <div className="flex-1">
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder={t('pages.prep.lessonElements.elementPlaceholder', 'Enter lesson element content...')}
                                                    className="min-h-[80px] resize-y"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 mt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                            onClick={() => remove(index)}
                                            disabled={isLoading || fields.length <= 1}
                                            title={t('pages.prep.lessonElements.removeElement', 'Remove Element')}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
