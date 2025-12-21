import { GradeSheetTable } from "@/components/GradeSheetTable"
import { ContentPage } from "@/components/layout/content-page"

export default function GradesPage() {
  return (
    <ContentPage 
      title="كشف النقاط" 
      description="إدارة ومتابعة علامات الطلاب"
      rtl
    >
      <GradeSheetTable />
    </ContentPage>
  )
}
