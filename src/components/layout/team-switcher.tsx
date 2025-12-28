import { LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useUser } from '@/features/users/api/use-user'

export function TeamSwitcher() {
  const { t } = useTranslation()
  const { data: user } = useUser()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent'
        >
          <div className='bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
            <LayoutDashboard className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {user?.name}
            </span>
            <span className='truncate text-xs'>
              {user?.role ? t(`auth.roles.${user.role}`) : ''}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
