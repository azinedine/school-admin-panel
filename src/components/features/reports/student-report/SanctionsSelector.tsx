import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Controller, useFormContext } from 'react-hook-form'

export function SanctionsSelector() {
    const { control } = useFormContext()

    const sanctions = [
        { id: 'parent_summons', label: 'Parent Summons' },
        { id: 'guidance_counselor_summons', label: 'Referral to Guidance Counselor' },
        { id: 'written_warning', label: 'Written Warning' },
        { id: 'disciplinary_council_referral', label: 'Referral to Disciplinary Council' },
    ]

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Proposed Sanctions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sanctions.map((sanction) => (
                    <div key={sanction.id} className="flex items-center space-x-2">
                        <Controller
                            control={control}
                            name={`sanctions.${sanction.id}`}
                            render={({ field }) => (
                                <Checkbox
                                    id={sanction.id}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor={sanction.id} className="cursor-pointer">{sanction.label}</Label>
                    </div>
                ))}
            </div>
        </div>
    )
}
