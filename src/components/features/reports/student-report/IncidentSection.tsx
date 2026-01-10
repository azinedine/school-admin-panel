import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useFormContext } from 'react-hook-form'

export function IncidentSection() {
    const { register, formState: { errors } } = useFormContext()

    return (
        <div className="space-y-2">
            <Label htmlFor="incident_description" className="font-semibold text-lg">
                Incident Description
            </Label>
            <Textarea
                id="incident_description"
                placeholder="Describe the incident in detail..."
                className="min-h-[200px] resize-none text-base"
                {...register('incident_description')}
            />
            {errors.incident_description && (
                <span className="text-destructive text-sm">
                    {errors.incident_description.message as string}
                </span>
            )}
        </div>
    )
}
