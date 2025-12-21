import { GradeSheetTable } from "@/components/GradeSheetTable"
import { ContentPage } from "@/components/layout/content-page"
import { useTranslation } from "react-i18next"
import { useDirection } from "@/hooks/use-direction"

export default function GradesPage() {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  
  return (
    <ContentPage 
      title={t('pages.grades.title')} 
      description={t('pages.grades.description')}
      rtl={isRTL}
    >
      <GradeSheetTable />
    </ContentPage>
  )
}
