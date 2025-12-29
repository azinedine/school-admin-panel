import { useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Plus, X, Loader2 } from 'lucide-react'
import { ClassContextDisplay } from './ClassContextDisplay'

import {
    lessonPreparationFormSchema,
    defaultFormValues,
    toFormData,
    toApiPayload,
    type LessonPreparationFormData,
    type LessonPreparationApiPayload,
    type LessonPreparation,
} from '@/schemas/lesson-preparation'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LessonPrepFormProps {
    initialData?: LessonPreparation | null
    onSubmit: (data: LessonPreparationApiPayload) => Promise<void>
    isLoading?: boolean
    classes?: string[]
    teachingMethods?: string[]
    assessmentMethods?: string[]
    onCancel?: () => void
}

const defaultTeachingMethods = [
    'Lecture',
    'Discussion',
    'Group Work',
    'Individual Work',
    'Practical Demonstration',
    'Case Study',
    'Brainstorming',
    'Problem-Based Learning',
]

const defaultAssessmentMethods = [
    'Quiz',
    'Test',
    'Assignment',
    'Presentation',
    'Peer Review',
    'Self-Assessment',
    'Practical Exam',
    'Project',
]

export function LessonPrepForm({
    initialData,
    onSubmit,
    isLoading = false,
    classes = [],
    teachingMethods = defaultTeachingMethods,
    assessmentMethods = defaultAssessmentMethods,
    onCancel,
}: LessonPrepFormProps) {
    const { t } = useTranslation()

    const form = useForm<LessonPreparationFormData>({
        resolver: zodResolver(lessonPreparationFormSchema),
        defaultValues: initialData
            ? toFormData(initialData)
            : (defaultFormValues as LessonPreparationFormData),
    })

    const {
        fields: objectiveFields,
        append: appendObjective,
        remove: removeObjective,
    } = useFieldArray<LessonPreparationFormData>({
        control: form.control,
        name: 'learning_objectives',
    })

    const {
        fields: topicFields,
        append: appendTopic,
        remove: removeTopic,
    } = useFieldArray<LessonPreparationFormData>({
        control: form.control,
        name: 'key_topics',
    })

    const {
        fields: methodFields,
        append: appendMethod,
        remove: removeMethod,
    } = useFieldArray<LessonPreparationFormData>({
        control: form.control,
        name: 'teaching_methods',
    })

    const {
        fields: assessmentFields,
        append: appendAssessment,
        remove: removeAssessment,
    } = useFieldArray<LessonPreparationFormData>({
        control: form.control,
        name: 'assessment_methods',
    })

    const {
        fields: resourceFields,
        append: appendResource,
        remove: removeResource,
    } = useFieldArray<LessonPreparationFormData>({
        control: form.control,
        name: 'resources_needed',
    })

    const handleSubmit = useCallback(
        async (data: LessonPreparationFormData) => {
            try {
                const apiPayload = toApiPayload(data)
                await onSubmit(apiPayload)
            } catch (error) {
                console.error('Form submission error:', error)
            }
        },
        [onSubmit]
    )

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('lessons.prep.basicInfo', 'Basic Information')}</CardTitle>
                        <CardDescription>{t('lessons.prep.basicInfoDesc', 'Lesson title, class and date')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('lessons.prep.lessonTitle', 'Lesson Title')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t('lessons.prep.lessonTitlePlaceholder', 'e.g., Introduction to Photosynthesis')}
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('lessons.prep.class', 'Class')}</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('lessons.prep.selectClass', 'Select class')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classes.length > 0 ? (
                                                    classes.map((className) => (
                                                        <SelectItem key={className} value={className}>
                                                            {className}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <>
                                                        <SelectItem value="1AS">1AS</SelectItem>
                                                        <SelectItem value="2AS">2AS</SelectItem>
                                                        <SelectItem value="3AS">3AS</SelectItem>
                                                        <SelectItem value="1AM">1AM</SelectItem>
                                                        <SelectItem value="2AM">2AM</SelectItem>
                                                        <SelectItem value="3AM">3AM</SelectItem>
                                                        <SelectItem value="4AM">4AM</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <ClassContextDisplay classId={field.value} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('lessons.prep.date', 'Date')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="duration_minutes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('lessons.prep.duration', 'Duration (min)')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('lessons.prep.description', 'Description')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('lessons.prep.descriptionPlaceholder', 'Brief description of the lesson...')}
                                            className="min-h-[80px]"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Content Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Learning Objectives */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('lessons.prep.learningObjectives', 'Learning Objectives')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {objectiveFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`learning_objectives.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1 space-y-0">
                                                <FormControl>
                                                    <Input
                                                        placeholder={`${t('lessons.prep.objectivePlaceholder', 'Objective')} ${index + 1}`}
                                                        {...field}
                                                        disabled={isLoading}
                                                        className="h-9"
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
                                        className="h-9 w-9 text-muted-foreground"
                                        onClick={() => removeObjective(index)}
                                        disabled={isLoading || objectiveFields.length === 1}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendObjective({ value: '' })}
                                disabled={isLoading}
                                className="w-full h-8 dashed border-dashed"
                            >
                                <Plus className="h-3 w-3 mr-2" />
                                {t('lessons.prep.addObjective', 'Add Objective')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Key Topics */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('lessons.prep.keyTopics', 'Key Topics')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {topicFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`key_topics.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1 space-y-0">
                                                <FormControl>
                                                    <Input
                                                        placeholder={`${t('lessons.prep.topicPlaceholder', 'Topic')} ${index + 1}`}
                                                        {...field}
                                                        disabled={isLoading}
                                                        className="h-9"
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
                                        className="h-9 w-9 text-muted-foreground"
                                        onClick={() => removeTopic(index)}
                                        disabled={isLoading || topicFields.length === 1}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendTopic({ value: '' })}
                                disabled={isLoading}
                                className="w-full h-8 dashed border-dashed"
                            >
                                <Plus className="h-3 w-3 mr-2" />
                                {t('lessons.prep.addTopic', 'Add Topic')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Methodology & Resources */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Teaching Methods */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('lessons.prep.teachingMethods', 'Teaching Methods')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {methodFields.map((field, index) => (
                                    <Badge key={field.id} variant="secondary" className="pl-2 pr-1 h-7">
                                        {field.value}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                            onClick={() => removeMethod(index)}
                                            disabled={isLoading}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                            <Select
                                onValueChange={(value) => {
                                    if (value && !methodFields.some((f) => f.value === value)) {
                                        appendMethod({ value })
                                    }
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder={t('lessons.prep.addMethod', 'Add method')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachingMethods
                                        .filter((method) => !methodFields.some((f) => f.value === method))
                                        .map((method) => (
                                            <SelectItem key={method} value={method}>
                                                {method}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Resources */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('lessons.prep.resources', 'Resources')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {resourceFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`resources_needed.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1 space-y-0">
                                                <FormControl>
                                                    <Input
                                                        placeholder={`${t('lessons.prep.resourcePlaceholder', 'Resource')} ${index + 1}`}
                                                        {...field}
                                                        disabled={isLoading}
                                                        className="h-9"
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
                                        className="h-9 w-9 text-muted-foreground"
                                        onClick={() => removeResource(index)}
                                        disabled={isLoading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendResource({ value: '' })}
                                disabled={isLoading}
                                className="w-full h-8 dashed border-dashed"
                            >
                                <Plus className="h-3 w-3 mr-2" />
                                {t('lessons.prep.addResource', 'Add Resource')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Assessment */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('lessons.prep.assessment', 'Assessment')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-3 block">{t('lessons.prep.assessmentMethods', 'Assessment Methods')}</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {assessmentFields.map((field, index) => (
                                    <Badge key={field.id} variant="secondary" className="pl-2 pr-1 h-7">
                                        {field.value}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                            onClick={() => removeAssessment(index)}
                                            disabled={isLoading}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                            <Select
                                onValueChange={(value) => {
                                    if (value && !assessmentFields.some((f) => f.value === value)) {
                                        appendAssessment({ value })
                                    }
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder={t('lessons.prep.addAssessmentMethod', 'Add assessment method')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {assessmentMethods
                                        .filter((method) => !assessmentFields.some((f) => f.value === method))
                                        .map((method) => (
                                            <SelectItem key={method} value={method}>
                                                {method}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <FormField
                            control={form.control}
                            name="assessment_criteria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('lessons.prep.assessmentCriteria', 'Assessment Criteria')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('lessons.prep.assessmentCriteriaPlaceholder', "Describe how you'll evaluate student performance...")}
                                            className="min-h-[80px]"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Status */}
                <Card>
                    <CardContent className="pt-6">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('lessons.prep.preparationStatus', 'Preparation Status')}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">{t('lessons.prep.status.draft', 'Draft (Work in Progress)')}</SelectItem>
                                            <SelectItem value="ready">{t('lessons.prep.status.ready', 'Ready to Teach')}</SelectItem>
                                            <SelectItem value="delivered">{t('lessons.prep.status.delivered', 'Mark as Delivered')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-8 z-10">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? t('lessons.prep.update', 'Update Preparation') : t('lessons.prep.create', 'Create Preparation')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
