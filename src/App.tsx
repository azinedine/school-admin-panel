import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            School Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Built with the latest Tailwind CSS and shadcn/ui
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                Manage student information and records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Students</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>
                Handle teacher profiles and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Teachers</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>
                Organize classes and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">View Classes</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Latest Tailwind CSS v4.1.13 + shadcn/ui components working perfectly!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
