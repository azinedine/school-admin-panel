import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradeSheetTable } from "@/components/GradeSheetTable"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function GradesPage() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 shrink-0">
        {/* Left side: Sidebar toggle */}
        <div className="flex items-center gap-3">
          <SidebarTrigger variant='outline' />
        </div>
        
        {/* Center: Title */}
        <div className="flex-1 text-right" dir="rtl">
          <CardTitle>كشف النقاط</CardTitle>
          <CardDescription>
            إدارة ومتابعة علامات الطلاب
          </CardDescription>
        </div>
        
        {/* Right side: Theme toggle */}
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <GradeSheetTable />
      </CardContent>
    </Card>
  )
}
