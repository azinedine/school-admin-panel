import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { format } from 'date-fns'
import { Loader2, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/store/types'

// Validation Schema
const profileSchema = z.object({
  name: z.string().min(2).optional(),
  name_ar: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  date_of_birth: z.date().optional(),
  wilaya: z.string().optional(),
  municipality: z.string().optional(),
  work_phone: z.string().optional(),
  office_location: z.string().optional(),
  date_of_hiring: z.date().optional(),
    years_of_experience: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === '' ? undefined : Number(val))),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface EditProfileDialogProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function EditProfileDialog({ user, isOpen, onClose }: EditProfileDialogProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      name_ar: user.name_ar || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender,
      // Handle date string to Date object conversion
      date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : undefined,
      wilaya: user.wilaya || '',
      municipality: user.municipality || '',
      work_phone: user.work_phone || '',
      office_location: user.office_location || '',
      date_of_hiring: user.date_of_hiring ? new Date(user.date_of_hiring) : undefined,
      years_of_experience: user.years_of_experience,
    },
  })

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: user.name || '',
        name_ar: user.name_ar || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender,
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : undefined,
        wilaya: user.wilaya || '',
        municipality: user.municipality || '',
        work_phone: user.work_phone || '',
        office_location: user.office_location || '',
        date_of_hiring: user.date_of_hiring ? new Date(user.date_of_hiring) : undefined,
        years_of_experience: user.years_of_experience,
      })
    }
  }, [user, isOpen, form])

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      // Format date for API (YYYY-MM-DD)
      const payload = {
        ...values,
        date_of_birth: values.date_of_birth ? format(values.date_of_birth, 'yyyy-MM-dd') : null,
        date_of_hiring: values.date_of_hiring ? format(values.date_of_hiring, 'yyyy-MM-dd') : null,
      }

      const response = await apiClient.put<{ data: User }>(`/v1/users/${user.id}`, payload)
      const updatedUser = response.data.data

      // Update global store
      setUser(updatedUser)
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })

      toast.success(t('common.updateSuccess', 'Profile updated successfully'))
      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error(t('common.error', 'Failed to update profile'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('profilePage.editProfile', 'Edit Profile')}</DialogTitle>
          <DialogDescription>
            {t('profilePage.editProfileDesc', 'Update your personal information.')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profilePage.fullName')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {/* Arabic Name */}
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profilePage.arabicName')}</FormLabel>
                    <FormControl>
                      <Input {...field} dir="rtl" placeholder="الاسم بالعربية" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profilePage.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profilePage.phone')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profilePage.gender')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('common.select')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">{t('profilePage.male')}</SelectItem>
                        <SelectItem value="female">{t('profilePage.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('profilePage.dateOfBirth')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t('common.pickDate')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profilePage.address')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wilaya - Text for now */}
              <FormField
                control={form.control}
                name="wilaya"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profilePage.wilaya')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Municipality - Text for now */}
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profilePage.municipality')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Admin only fields (if user is admin) */}
            {(user.role === 'admin' || user.role === 'manager' || user.role === 'super_admin') && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                  <FormField
                    control={form.control}
                    name="work_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profilePage.workPhone')}</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="office_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profilePage.officeLocation')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
            )}

            <DialogFooter className="mt-6">
               <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
