import { FileText } from 'lucide-react'

export function ReportHeader({
    institutionName,
    academicYear
}: {
    institutionName: string
    academicYear: string
}) {
    return (
        <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
                <div className="text-center w-1/3">
                    <p className="font-bold text-sm">PEOPLE'S DEMOCRATIC REPUBLIC OF ALGERIA</p>
                    <p className="text-xs mt-1">MINISTRY OF NATIONAL EDUCATION</p>
                </div>
                <div className="text-center w-1/3 flex flex-col items-center">
                    <FileText className="h-10 w-10 text-primary mb-2" />
                    <h1 className="text-2xl font-bold uppercase tracking-wider border-2 border-primary px-4 py-1">
                        Student Report
                    </h1>
                </div>
                <div className="text-center w-1/3">
                    <div className="text-sm space-y-1 text-right" dir="rtl">
                        <p><span className="font-bold">المؤسسة:</span> {institutionName}</p>
                        <p><span className="font-bold">السنة الدراسية:</span> {academicYear}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
