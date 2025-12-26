import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/auth-store'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useDirection } from '@/hooks/use-direction'
import { 
  PARENT_SIDEBAR, 
  STUDENT_SIDEBAR, 
  TEACHER_SIDEBAR, 
  ADMIN_SIDEBAR, 
  SUPER_ADMIN_SIDEBAR 
} from './data/sidebar-permissions'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isRTL } = useDirection()
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  // Select sidebar items based on role
  const sidebarItems = useMemo(() => {
    switch (user?.role) {
      case 'parent':
        return PARENT_SIDEBAR
      case 'student':
        return STUDENT_SIDEBAR
      case 'teacher':
        return TEACHER_SIDEBAR
      case 'admin':
        return ADMIN_SIDEBAR
      case 'super_admin':
        return SUPER_ADMIN_SIDEBAR
      default:
        return []
    }
  }, [user?.role])

  return (
    <Sidebar 
      collapsible='icon' 
      variant='floating' 
      side={isRTL ? 'right' : 'left'}
      {...props}
    >
      <SidebarHeader>
        <div className='flex items-center justify-between gap-2 p-2'>
           <div className='flex flex-col px-2 truncate'>
             <span className='font-bold text-sm text-primary truncate'>
               {user?.name || 'School Manager'}
             </span>
             <span className='text-xs text-muted-foreground truncate capitalize'>
               {user?.role ? t(`auth.roles.${user.role}`, user.role) : ''}
             </span>
           </div>
          <div className='group-data-[collapsible=icon]:hidden'>
            <LanguageSwitcher />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarItems.map((group) => (
          <NavGroup 
            key={group.title} 
            title={group.title} 
            items={group.items} 
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
