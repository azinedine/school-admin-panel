import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { LessonPreparation } from '@/schemas/lesson-preparation'

interface LessonPrepDetailsProps {
  data: LessonPreparation
}

const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
  },
  ready: {
    label: 'Ready',
    color: 'bg-blue-100 text-blue-800',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
  },
} as const

export function LessonPrepDetails({ data }: LessonPrepDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
        <div className="flex gap-3 flex-wrap">
          <Badge variant="outline" className={statusConfig[data.status].color}>
            {statusConfig[data.status].label}
          </Badge>
          <Badge variant="secondary">{data.subject}</Badge>
          <Badge variant="secondary">{data.class}</Badge>
        </div>
      </div>

      <Separator />

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="font-medium">{formatDate(data.date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">{data.duration_minutes} minutes</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Subject</p>
              <p className="font-medium">{data.subject}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Class</p>
              <p className="font-medium">{data.class}</p>
            </div>
          </div>

          {data.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      {data.learning_objectives && data.learning_objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
            <CardDescription>What students should be able to do</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.learning_objectives.map((objective, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="font-semibold text-primary min-w-6">{index + 1}.</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Key Topics */}
      {data.key_topics && data.key_topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Topics</CardTitle>
            <CardDescription>Main topics to be covered</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.key_topics.map((topic, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="font-semibold text-primary min-w-6">{index + 1}.</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Teaching Methods */}
      {data.teaching_methods && data.teaching_methods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Teaching Methods</CardTitle>
            <CardDescription>How the lesson will be delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.teaching_methods.map((method) => (
                <Badge key={method} variant="secondary">
                  {method}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Needed */}
      {data.resources_needed && data.resources_needed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources Needed</CardTitle>
            <CardDescription>Materials and equipment required</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.resources_needed.map((resource, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span className="text-primary">•</span>
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
          <CardDescription>How student learning will be evaluated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.assessment_methods && data.assessment_methods.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Assessment Methods</p>
              <div className="flex flex-wrap gap-2">
                {data.assessment_methods.map((method) => (
                  <Badge key={method} variant="secondary">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.assessment_criteria && (
            <>
              {data.assessment_methods && data.assessment_methods.length > 0 && <Separator />}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Assessment Criteria</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {data.assessment_criteria}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      {data.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDateTime(data.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDateTime(data.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
