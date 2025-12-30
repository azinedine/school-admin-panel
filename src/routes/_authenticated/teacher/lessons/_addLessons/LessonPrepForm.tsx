import { useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useCurrentUser } from '@/store/auth-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'

import {
  lessonPreparationFormSchema as lessonPreparationSchema,
  defaultFormValues as lessonPreparationDefaults,
  toFormData,
  toApiPayload,
  type LessonPreparationFormData,
  type LessonPreparation,
  type LessonPreparationApiPayload,
} from '@/schemas/lesson-preparation'

import {
  Form,
  FormControl,
  FormDescription,
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
  initialData?: LessonPreparation
  onSubmit: (data: LessonPreparationApiPayload) => Promise<void>
  isLoading?: boolean
  classes?: string[]
  subjects?: string[]
  teachingMethods?: string[]
  assessmentMethods?: string[]
  onCancel?: () => void
  language?: string
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
  subjects = [],
  teachingMethods = defaultTeachingMethods,
  assessmentMethods = defaultAssessmentMethods,
  onCancel,
  // language = 'en', // Reserved for future localization
}: LessonPrepFormProps) {

  const user = useCurrentUser()
  const availableClasses = classes.length > 0 ? classes : (user?.assigned_classes || [])



  const form = useForm<LessonPreparationFormData>({
    resolver: zodResolver(lessonPreparationSchema),
    defaultValues: initialData ? toFormData(initialData) : (lessonPreparationDefaults as LessonPreparationFormData),
  })

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control: form.control,
    name: 'learning_objectives',
  })

  const {
    fields: topicFields,
    append: appendTopic,
    remove: removeTopic,
  } = useFieldArray({
    control: form.control,
    name: 'key_topics',
  })

  const {
    fields: methodFields,
    append: appendMethod,
    remove: removeMethod,
  } = useFieldArray({
    control: form.control,
    name: 'teaching_methods',
  })

  const {
    fields: assessmentFields,
    append: appendAssessment,
    remove: removeAssessment,
  } = useFieldArray({
    control: form.control,
    name: 'assessment_methods',
  })

  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({
    control: form.control,
    name: 'resources_needed',
  })

  const handleSubmit = useCallback(
    async (data: LessonPreparationFormData) => {
      try {
        await onSubmit(toApiPayload(data))
      } catch (error) {
        console.error('Form submission error:', error)
      }
    },
    [onSubmit]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Lesson title, subject, class and date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Introduction to Photosynthesis"
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableClasses.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
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
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="45"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the lesson..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Optional. Provide context and overview for the lesson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
            <CardDescription>What students should be able to do after this lesson</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {objectiveFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`learning_objectives.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Objective ${index + 1}`}
                          {...field}
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
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Objective
            </Button>
          </CardContent>
        </Card>

        {/* Key Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Topics</CardTitle>
            <CardDescription>Main topics to be covered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topicFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`key_topics.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Topic ${index + 1}`}
                          {...field}
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
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          </CardContent>
        </Card>

        {/* Teaching Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Methods</CardTitle>
            <CardDescription>How you'll deliver this lesson</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {methodFields.map((field, index) => (
                <Badge key={field.id} variant="secondary" className="pl-2 pr-1">
                  {field.value}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
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
              <SelectTrigger>
                <SelectValue placeholder="Select teaching method" />
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

        {/* Resources Needed */}
        <Card>
          <CardHeader>
            <CardTitle>Resources Needed</CardTitle>
            <CardDescription>Materials and equipment required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resourceFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`resources_needed.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Resource ${index + 1}`}
                          {...field}
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
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </CardContent>
        </Card>

        {/* Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment</CardTitle>
            <CardDescription>How you'll evaluate student learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Assessment Methods</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {assessmentFields.map((field, index) => (
                  <Badge key={field.id} variant="secondary" className="pl-2 pr-1">
                    {field.value}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2"
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
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment method" />
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
                  <FormLabel>Assessment Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe how you'll evaluate student performance..."
                      className="min-h-[80px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Optional. Define grading criteria and rubrics.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Any other relevant information</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes, reminders, or modifications for this lesson..."
                      className="min-h-[100px]"
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
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Status</FormLabel>
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="ready">Ready to Teach</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Draft: Work in progress. Ready: Completed and ready. Delivered: Already taught.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Preparation' : 'Create Preparation'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
