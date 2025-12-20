import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradeSheetTable } from "@/components/GradeSheetTable"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ModeToggle } from "@/components/mode-toggle"

export default function GradesPage() {
  return (
    <>
      <Header fixed>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </Header>

      <Main>
        <div className="w-full px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right" dir="rtl">كشف النقاط</CardTitle>
              <CardDescription className="text-right" dir="rtl">
                إدارة ومتابعة علامات الطلاب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GradeSheetTable />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
