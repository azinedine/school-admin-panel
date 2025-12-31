import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import {
  BookOpen,
  Layers,
  Target,
  Lightbulb,
  Users,
  Package,
  GraduationCap,
  FileText,
  CheckCircle2,
  CalendarDays,
  Timer,
  School
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonPrepDetailsProps {
  data: LessonPreparation
}

const statusConfig = {
  draft: {
    label: 'Draft',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
  },
  ready: {
    label: 'Ready',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
  },
} as const

export function LessonPrepDetails({ data }: LessonPrepDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const status = statusConfig[data.status]

  return (
    <div className="h-full flex flex-col">
      {/* Modern Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn('capitalize px-2.5 py-0.5', status.className)}>
                {status.label}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                #{data.lesson_number}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground/90 leading-tight">
              {data.knowledge_resource}
            </h1>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground hidden sm:flex">
            <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(data.date)}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full border">
              <Timer className="h-4 w-4" />
              <span>{data.duration_minutes} min</span>
            </div>
          </div>
        </div>

        {/* Pedagogical Grid - Quick View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/10 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-background rounded-full shadow-sm">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domain</p>
                <p className="font-medium text-foreground">{data.domain}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-background rounded-full shadow-sm">
                <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Learning Unit</p>
                <p className="font-medium text-foreground">{data.learning_unit}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="flex-1 w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-1">
          <TabsTrigger value="overview" className="py-2.5">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="content" className="py-2.5">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="py-2.5">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Evaluation</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="py-2.5">
            <span className="flex items-center gap-2">
              <School className="h-4 w-4" />
              <span className="hidden sm:inline">Info & Notes</span>
            </span>
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">

          {/* 1. Objectives & Topics Row */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Objectives */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground/80">
                <Target className="h-5 w-5 text-blue-500" />
                Learning Objectives
              </h3>
              {data.learning_objectives?.length > 0 ? (
                <ul className="space-y-2">
                  {data.learning_objectives.map((obj, i) => (
                    <li key={i} className="flex gap-3 bg-muted/30 p-3 rounded-lg border text-sm">
                      <span className="font-bold text-blue-500/80 font-mono">{i + 1}</span>
                      <span className="leading-relaxed">{obj}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground italic px-4 py-3 bg-muted/20 border border-dashed rounded-lg">
                  No objectives specified.
                </div>
              )}
            </div>

            {/* Key Topics */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground/80">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Key Topics
              </h3>
              {data.key_topics?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.key_topics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm font-normal bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50">
                      {topic}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic px-4 py-3 bg-muted/20 border border-dashed rounded-lg">
                  No topics specified.
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 2. Methods & Resources Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Teaching Methods */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground/80">
                <Users className="h-5 w-5 text-emerald-500" />
                Teaching Methods
              </h3>
              {data.teaching_methods?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.teaching_methods.map((method, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-emerald-50/50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium">{method}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">No methods selected.</div>
              )}
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold text-lg text-foreground/80">
                <Package className="h-5 w-5 text-purple-500" />
                Resources Needed
              </h3>
              {data.resources_needed?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.resources_needed.map((res, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-purple-50/50 dark:bg-purple-900/10">
                      <div className="w-1 h-4 bg-purple-400 rounded-full shrink-0" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">No resources listed.</div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl">Lesson Plan</h3>
              <Badge variant="outline">{data.lesson_elements?.length ?? 0} Steps</Badge>
            </div>

            <div className="space-y-8 relative pl-6 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-border">
              {data.lesson_elements?.map((element, i) => (
                <div key={i} className="relative group">
                  {/* Content */}
                  <div className="bg-muted/30 p-4 rounded-lg border group-hover:bg-muted/50 transition-colors">
                    <div className="absolute -left-[31px] top-3 bg-background border-2 border-primary w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                      {i + 1}
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                      {element.content}
                    </div>
                  </div>
                </div>
              ))}
              {(!data.lesson_elements || data.lesson_elements.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No lesson content added.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* EVALUATION TAB */}
        <TabsContent value="evaluation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Evaluation Strategy</CardTitle>
                  <CardDescription>
                    Type: <span className="font-medium text-primary capitalize">{data.evaluation_type}</span>
                  </CardDescription>
                </div>
                <GraduationCap className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-5 rounded-lg border-l-4 border-l-primary/50">
                <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-muted-foreground">Content & Requirements</h4>
                <p className="whitespace-pre-wrap leading-relaxed">{data.evaluation_content}</p>
              </div>

              {/* Assessment Methods */}
              {data.assessment_methods && data.assessment_methods.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Assessment Methods
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.assessment_methods.map((method, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INFO TAB */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="pb-4 border-b">
                  <span className="text-muted-foreground block mb-1">Subject</span>
                  <span className="font-medium text-lg">{data.subject}</span>
                </div>
                <div className="pb-4 border-b">
                  <span className="text-muted-foreground block mb-1">Class / Level</span>
                  <span className="font-medium text-lg">{data.level}</span>
                </div>
                <div className="pb-4 border-b">
                  <span className="text-muted-foreground block mb-1">Date</span>
                  <span className="font-medium text-lg">{formatDate(data.date)}</span>
                </div>
                <div className="pb-4 border-b">
                  <span className="text-muted-foreground block mb-1">Duration</span>
                  <span className="font-medium text-lg">{data.duration_minutes} minutes</span>
                </div>
              </div>

              {data.notes && (
                <div>
                  <h4 className="font-medium mb-2">Teacher Notes</h4>
                  <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-lg text-sm border border-yellow-100 dark:border-yellow-900/20 text-yellow-900 dark:text-yellow-200">
                    {data.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
