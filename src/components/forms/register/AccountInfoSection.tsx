import { useFormContext, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TextField } from "../TextField"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AccountInfoSection() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { control, register, formState: { errors } } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextField
          name="name"
          label={t('auth.register.name')}
          required
        />
        <TextField
          name="email"
          label={t('auth.login.email')}
          type="email"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="password">{t('auth.login.password')} <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              {...register('password')}
              className={cn(isRTL ? "pl-10" : "pr-10", errors.password && 'border-destructive')}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRTL ? "left-0" : "right-0"}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
        </div>
        
        <div className="space-y-1.5">
          <Label>{t('auth.register.role')} <span className="text-destructive">*</span></Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('auth.roles.admin')}</SelectItem>
                  <SelectItem value="teacher">{t('auth.roles.teacher')}</SelectItem>
                  <SelectItem value="student">{t('auth.roles.student')}</SelectItem>
                  <SelectItem value="parent">{t('auth.roles.parent')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </>
  )
}
