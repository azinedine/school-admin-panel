import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { LessonDetailFormData, GroupTimesType, ActiveGroupsType } from '../dialog-config.ts'
import type { DailyPlanEntry } from '@/store/prep-store'
import type { TFunction } from 'i18next'

interface SchedulingSectionProps {
    t: TFunction
    formData: LessonDetailFormData
    updateFormField: (field: keyof LessonDetailFormData, value: unknown) => void
    activeGroups: ActiveGroupsType
    groupTimes: GroupTimesType
    toggleGroup: (g: 'first' | 'second') => void
    updateGroupTime: (g: 'first' | 'second', type: 'start' | 'end', value: string) => void
    existingLesson?: DailyPlanEntry
}

/**
 * Single Responsibility: Scheduling and group selection
 */
export function SchedulingSection({
    t,
    formData,
    updateFormField,
    activeGroups,
    groupTimes,
    toggleGroup,
    updateGroupTime,
    existingLesson,
}: SchedulingSectionProps) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="mode">{t('pages.prep.mode')}</Label>
                <Select
                    value={formData.mode}
                    onValueChange={(value) => updateFormField('mode', value as 'fullClass' | 'groups')}
                >
                    <SelectTrigger id="mode">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fullClass">{t('pages.prep.fullClass')}</SelectItem>
                        <SelectItem value="groups">{t('pages.prep.groups.title')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Full Class Time */}
            {formData.mode === 'fullClass' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startTime">{t('pages.prep.startTime')} *</Label>
                        <Input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => updateFormField('startTime', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="endTime">{t('pages.prep.endTime')} *</Label>
                        <Input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => updateFormField('endTime', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Multi-Group Time Selection (New Lessons) */}
            {formData.mode === 'groups' && !existingLesson && (
                <div className="space-y-4 pt-2 border rounded-md p-4">
                    <Label>{t('pages.prep.groups.title')}</Label>

                    {/* Group 1 */}
                    <div className="flex items-end gap-4">
                        <div className="flex items-center space-x-2 pb-2.5">
                            <Checkbox
                                id="group1"
                                checked={activeGroups.includes('first')}
                                onCheckedChange={() => toggleGroup('first')}
                            />
                            <Label htmlFor="group1" className="cursor-pointer font-normal">
                                {t('pages.prep.group1')}
                            </Label>
                        </div>
                        {activeGroups.includes('first') && (
                            <div className="flex gap-2 flex-1">
                                <div className="grid gap-1 flex-1">
                                    <Label className="text-xs text-muted-foreground">
                                        {t('pages.prep.startTime')}
                                    </Label>
                                    <Input
                                        type="time"
                                        className="h-8"
                                        value={groupTimes.first.start}
                                        onChange={(e) => updateGroupTime('first', 'start', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-1 flex-1">
                                    <Label className="text-xs text-muted-foreground">
                                        {t('pages.prep.endTime')}
                                    </Label>
                                    <Input
                                        type="time"
                                        className="h-8"
                                        value={groupTimes.first.end}
                                        onChange={(e) => updateGroupTime('first', 'end', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Group 2 */}
                    <div className="flex items-end gap-4">
                        <div className="flex items-center space-x-2 pb-2.5">
                            <Checkbox
                                id="group2"
                                checked={activeGroups.includes('second')}
                                onCheckedChange={() => toggleGroup('second')}
                            />
                            <Label htmlFor="group2" className="cursor-pointer font-normal">
                                {t('pages.prep.group2')}
                            </Label>
                        </div>
                        {activeGroups.includes('second') && (
                            <div className="flex gap-2 flex-1">
                                <div className="grid gap-1 flex-1">
                                    <Label className="text-xs text-muted-foreground">
                                        {t('pages.prep.startTime')}
                                    </Label>
                                    <Input
                                        type="time"
                                        className="h-8"
                                        value={groupTimes.second.start}
                                        onChange={(e) => updateGroupTime('second', 'start', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-1 flex-1">
                                    <Label className="text-xs text-muted-foreground">
                                        {t('pages.prep.endTime')}
                                    </Label>
                                    <Input
                                        type="time"
                                        className="h-8"
                                        value={groupTimes.second.end}
                                        onChange={(e) => updateGroupTime('second', 'end', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {activeGroups.length === 0 && (
                        <p className="text-xs text-destructive">
                            {t('pages.prep.selectAtLeastOneGroup')}
                        </p>
                    )}
                </div>
            )}

            {/* Edit Mode Single Group Select */}
            {formData.mode === 'groups' && existingLesson && (
                <div className="grid gap-2">
                    <Label htmlFor="group">{t('pages.prep.selectGroup')}</Label>
                    <Select
                        value={formData.group}
                        onValueChange={(value) =>
                            updateFormField('group', value as 'first' | 'second')
                        }
                    >
                        <SelectTrigger id="group">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="first">{t('pages.prep.group1')}</SelectItem>
                            <SelectItem value="second">{t('pages.prep.group2')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="startTime">{t('pages.prep.startTime')} *</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => updateFormField('startTime', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endTime">{t('pages.prep.endTime')} *</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => updateFormField('endTime', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
