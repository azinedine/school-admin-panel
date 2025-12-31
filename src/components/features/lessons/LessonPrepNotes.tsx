import { type Control, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface LessonPrepNotesProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepNotes({
    control,
    isLoading,
    language,
}: LessonPrepNotesProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'notes_list',
    })

    return (
        <Card className="border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <CardTitle className="text-lg">
                            {t('pages.prep.notes', 'Teacher Notes')}
                        </CardTitle>
                    </div>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => append({ content: '' })}
                        disabled={isLoading}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t('common.add', 'Add Note')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {fields.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-8 border-2 border-dashed rounded-xl bg-muted/10 border-muted">
                        <p className="text-muted-foreground font-medium mb-1">
                            {t('pages.prep.noNotes', 'No notes added')}
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            {t('pages.prep.notesOptional', 'Optional: Add private notes for yourself')}
                        </p>
                    </div>
                )}

                {fields.map((field, index) => (
                    <div key={field.id} className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <FormField
                            control={control}
                            name={`notes_list.${index}.content`}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex gap-4 items-start">
                                        <Badge variant="outline" className="mt-2 h-5 w-5 flex items-center justify-center rounded-full shrink-0 border-primary/20 bg-primary/5 text-primary text-[10px]">
                                            {index + 1}
                                        </Badge>
                                        <div className="flex-1">
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder={t('pages.prep.notesPlaceholder', 'Enter note content...')}
                                                    className="min-h-[60px] resize-y bg-background"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0 mt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                                            onClick={() => remove(index)}
                                            disabled={isLoading}
                                        >
                                            <X className="h-3.5 w-3.5" />
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
