import { CircleDashed, CheckCircle2, Send } from 'lucide-react'

export const statusConfig = {
    draft: {
        label: 'Draft',
        className:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
        icon: CircleDashed,
    },
    ready: {
        label: 'Ready',
        className:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
        icon: CheckCircle2,
    },
    delivered: {
        label: 'Delivered',
        className:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
        icon: Send,
    },
} as const

