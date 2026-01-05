import { CheckCircle2, BookOpen } from 'lucide-react'

interface ClassContextContentProps {
    name: string
    subject: string
}

export function ClassContextContent({ name, subject }: ClassContextContentProps) {
    return (
        <div className="mt-2 flex items-center gap-2 p-3 rounded-md bg-primary/5 border border-primary/10 text-sm text-primary animate-in fade-in transition-all">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-medium">Selected: {name}</span>
            <span className="text-muted-foreground mx-1">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                <span>
                    Teaching: <span className="text-foreground font-medium">{subject}</span>
                </span>
            </div>
        </div>
    )
}
