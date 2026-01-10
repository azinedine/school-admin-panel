import { Card } from '@/components/ui/card'

interface StudentInfoBlockProps {
    studentName: string
    className: string
    date: string
    teacherName: string
}

export function StudentInfoBlock({ studentName, className, date, teacherName }: StudentInfoBlockProps) {
    return (
        <Card className="p-4 bg-muted/20 border-muted">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Student</label>
                    <p className="font-medium text-lg">{studentName}</p>
                </div>
                <div>
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Class</label>
                    <p className="font-medium text-lg">{className}</p>
                </div>
                <div>
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Report Date</label>
                    <p className="font-medium">{date}</p>
                </div>
                <div>
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Teacher</label>
                    <p className="font-medium">{teacherName}</p>
                </div>
            </div>
        </Card>
    )
}
