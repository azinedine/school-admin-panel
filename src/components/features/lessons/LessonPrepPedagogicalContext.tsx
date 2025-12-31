import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Layers, Book, Bookmark, Library } from 'lucide-react'
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface LessonPrepPedagogicalContextProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
}

export function LessonPrepPedagogicalContext({
    control,
    isLoading,
    language,
}: LessonPrepPedagogicalContextProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <Card className="h-full border-2 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Layers className="h-5 w-5 text-indigo-500" />
                    </div>
                    <CardTitle className="text-lg">
                        {t('pages.prep.lessonStructure.title', 'Lesson Structure')}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {/* Domain Field */}
                <FormField
                    control={control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-primary/80">
                                <Book className="h-4 w-4" />
                                {t('pages.prep.domain', 'Domain')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t('pages.prep.lessonStructure.fieldPlaceholder', 'Enter domain')}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Learning Unit Field */}
                <FormField
                    control={control}
                    name="learning_unit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-primary/80">
                                <Bookmark className="h-4 w-4" />
                                {t('pages.prep.learningUnit', 'Learning Unit')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t('pages.prep.lessonStructure.learningSegmentPlaceholder', 'Enter unit')}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Knowledge Resource Field */}
                <FormField
                    control={control}
                    name="knowledge_resource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-primary/80">
                                <Library className="h-4 w-4" />
                                {t('pages.prep.knowledgeResource', 'Knowledge Resource')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t('pages.prep.lessonStructure.knowledgeResourcePlaceholder', 'Enter resource')}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
