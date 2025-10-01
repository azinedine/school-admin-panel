import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentsTable } from "@/components/StudentsTable"

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student information and records</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>A table of registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



