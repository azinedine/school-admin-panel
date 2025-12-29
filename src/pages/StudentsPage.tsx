import { StudentsTable } from "@/routes/_authenticated/student/StudentsTable"
import { ContentPage } from "@/components/layout/content-page"

export default function StudentsPage() {
  return (
    <ContentPage
      title="Students"
      description="Manage and view student records"
    >
      <StudentsTable />
    </ContentPage>
  )
}
