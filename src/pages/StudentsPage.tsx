import { Card, CardContent } from "@/components/ui/card"
import { StudentsTable } from "@/components/StudentsTable"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ModeToggle } from "@/components/mode-toggle"

export default function StudentsPage() {
  return (
    <>
      <Header fixed>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </Header>

      <Main>
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <StudentsTable />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
