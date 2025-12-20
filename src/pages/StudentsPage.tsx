import { Card, CardContent } from "@/components/ui/card"
import { StudentsTable } from "@/components/StudentsTable"

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <StudentsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



