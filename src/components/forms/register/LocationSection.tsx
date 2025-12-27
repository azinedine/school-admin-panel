import { useFormContext, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// Hooks
import { useWilayas, useMunicipalities, useInstitutions } from "@/hooks/use-institutions"

export function LocationSection() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { control, watch, formState: { errors } } = useFormContext()

  const selectedWilaya = watch('wilaya')
  const selectedMunicipality = watch('municipality')

  // Data Fetching
  const { data: wilayas, isLoading: loadingWilayas } = useWilayas()
  const { data: municipalities, isLoading: loadingMunicipalities } = useMunicipalities(
    selectedWilaya ? parseInt(selectedWilaya) : undefined
  )
  const { data: institutionsData, isLoading: loadingInstitutions } = useInstitutions(
    selectedMunicipality ? { municipality_id: parseInt(selectedMunicipality), is_active: true } : {}
  )
  const institutions = institutionsData?.data || []

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div className="space-y-1.5">
        <Label>{t('auth.register.wilaya')} <span className="text-destructive">*</span></Label>
        <Controller
          name="wilaya"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={loadingWilayas}>
              <SelectTrigger className={cn(errors.wilaya && 'border-destructive')}>
                 {loadingWilayas ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-muted-foreground">{t('common.loading')}</span>
                    </div>
                 ) : (
                    <SelectValue placeholder={t('auth.register.selectWilaya')} />
                 )}
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {wilayas?.map(w => (
                  <SelectItem key={w.code} value={w.code}>
                    {isRTL ? (w.name_ar || w.name) : w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.wilaya && <p className="text-xs text-destructive">{errors.wilaya.message as string}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>{t('auth.register.municipality')} <span className="text-destructive">*</span></Label>
        <Controller
          name="municipality"
          control={control}
          render={({ field }) => (
            <Select 
              value={field.value} 
              onValueChange={field.onChange} 
              disabled={!selectedWilaya || loadingMunicipalities}
            >
              <SelectTrigger className={cn(errors.municipality && 'border-destructive')}>
                  {loadingMunicipalities ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-muted-foreground">{t('common.loading')}</span>
                    </div>
                 ) : (
                    <SelectValue placeholder={t('auth.register.selectMunicipality')} />
                 )}
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {municipalities?.map(m => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {isRTL ? (m.name_ar || m.name) : m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.municipality && <p className="text-xs text-destructive">{errors.municipality.message as string}</p>}
      </div>

      <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
        <Label>{t('auth.register.institution')} <span className="text-destructive">*</span></Label>
        <Controller
          name="institution"
          control={control}
          render={({ field }) => (
            <Select 
              value={field.value} 
              onValueChange={field.onChange} 
              disabled={!selectedMunicipality || loadingInstitutions}
            >
              <SelectTrigger className={cn(errors.institution && 'border-destructive')}>
                  {loadingInstitutions ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-muted-foreground">{t('common.loading')}</span>
                    </div>
                 ) : (
                    <SelectValue placeholder={t('auth.register.selectInstitution')} />
                 )}
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {institutions?.map(i => (
                  <SelectItem key={i.id} value={i.id.toString()}>
                    {isRTL ? (i.name_ar || i.name) : i.name}
                  </SelectItem>
                ))}
                {!loadingInstitutions && institutions.length === 0 && (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                        No institutions found
                    </div>
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.institution && <p className="text-xs text-destructive">{errors.institution.message as string}</p>}
      </div>
    </div>
  )
}
