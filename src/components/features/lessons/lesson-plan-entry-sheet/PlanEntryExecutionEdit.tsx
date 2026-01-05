import { useTranslation } from 'react-i18next'
import { Clock, User, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TIME_SLOTS } from './usePlanEntryForm'

interface PlanEntryExecutionEditProps {
    mode: 'fullClass' | 'groups'
    setMode: (mode: 'fullClass' | 'groups') => void
    date: string
    setDate: (date: string) => void
    timeSlot: string
    setTimeSlot: (slot: string) => void
    secondaryTimeSlot: string
    setSecondaryTimeSlot: (slot: string) => void
    practicalWork: boolean
    setPracticalWork: (val: boolean) => void
    homework: boolean
    setHomework: (val: boolean) => void
}

export function PlanEntryExecutionEdit({
    mode,
    setMode,
    date,
    setDate,
    timeSlot,
    setTimeSlot,
    secondaryTimeSlot,
    setSecondaryTimeSlot,
    practicalWork,
    setPracticalWork,
    homework,
    setHomework,
}: PlanEntryExecutionEditProps) {
    const { t } = useTranslation()

    const isGroups = mode === 'groups'
    const timeSlotLabel = isGroups
        ? t('pages.prep.details.group1Time')
        : t('pages.prep.details.firstSessionHour')
    const secondaryTimeSlotLabel = isGroups
        ? t('pages.prep.details.group2Time')
        : t('pages.prep.details.secondSessionHour')

    return (
        <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                {t('pages.prep.details.executionDetails')}
            </h3>

            <div className="space-y-4 pl-6 rtl:pr-6 rtl:pl-0">
                {/* Mode Toggle */}
                <div className="space-y-2">
                    <Label>{t('pages.prep.details.schedulingMode')}</Label>
                    <Tabs
                        value={mode}
                        onValueChange={(val) => setMode(val as 'fullClass' | 'groups')}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="fullClass" className="gap-2">
                                <User className="h-4 w-4" />
                                {t('pages.prep.details.fullClass')}
                            </TabsTrigger>
                            <TabsTrigger value="groups" className="gap-2">
                                <Users className="h-4 w-4" />
                                {t('pages.prep.details.groups')}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <Label>{t('pages.prep.table.date')}</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                {/* Time Slots */}
                {mode === 'groups' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{timeSlotLabel}</Label>
                            <Select value={timeSlot} onValueChange={setTimeSlot}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('pages.prep.table.time')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_SLOTS.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                            {slot}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{secondaryTimeSlotLabel}</Label>
                            <Select value={secondaryTimeSlot} onValueChange={setSecondaryTimeSlot}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('pages.prep.status.none')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('pages.prep.status.none')}</SelectItem>
                                    {TIME_SLOTS.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                            {slot}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>{timeSlotLabel}</Label>
                        <Select value={timeSlot} onValueChange={setTimeSlot}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('pages.prep.table.time')} />
                            </SelectTrigger>
                            <SelectContent>
                                {TIME_SLOTS.map((slot) => (
                                    <SelectItem key={slot} value={slot}>
                                        {slot}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Switches */}
                <div className="flex flex-col gap-4 pt-2">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label>{t('pages.prep.details.practicalWork')}</Label>
                        <Switch checked={practicalWork} onCheckedChange={setPracticalWork} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label>{t('pages.prep.details.homework')}</Label>
                        <Switch checked={homework} onCheckedChange={setHomework} />
                    </div>
                </div>
            </div>
        </div>
    )
}
