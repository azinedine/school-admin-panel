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
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { sidebarData } from './data/sidebar-data'
import type { NavGroup as NavGroupType } from './types'
import { useDirection } from '@/hooks/use-direction'
import { useGradesStore } from '@/store/grades-store'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isRTL } = useDirection()
  const { t } = useTranslation()
  const classes = useGradesStore((state) => state.classes)
  const user = useAuthStore((state) => state.user)

  // Build dynamic nav groups with live classes and permission filtering
  const dynamicNavGroups = useMemo(() => {
    return (sidebarData.navGroups as unknown as NavGroupType[]).map((group) => {
      // Filter items based on permissions
      const filteredItems = group.items.filter((item) => {
        // Users Management requires specific roles
        if (item.title === 'nav.usersManagement') {
          const allowedRoles = ['admin', 'manager', 'super_admin']
          return user?.role && allowedRoles.includes(user.role)
        }
        return true
      })

      const items = filteredItems.map((item) => {
        // Check if this is the Grades item
        if (item.title === 'nav.grades.title') {
// ... (rest of the grades logic remains the same)
          const classItems = classes.map((cls) => ({
            title: cls.name, // Use class name directly (not translation key)
            url: `/grades?class=${cls.id}`,
          }))
          
          // If no classes, add empty state message
          if (classItems.length === 0) {
            return {
              ...item,
              items: [
                {
                  title: t('nav.grades.noClasses'),
                  url: '/grades',
                  disabled: true,
                }
              ]
            }
          }
          
          return {
            ...item,
            items: classItems
          }
        }
        return item
      })
      
      return { ...group, items }
    })
  }, [classes, t, user])

  return (
    <Sidebar 
      collapsible='icon' 
      variant='floating' 
      side={isRTL ? 'right' : 'left'}
      {...props}
    >
      <SidebarHeader>
        <div className='flex items-center justify-between gap-2'>
          <TeamSwitcher />
          <div className='group-data-[collapsible=icon]:hidden'>
            <LanguageSwitcher />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {dynamicNavGroups.map((group) => (
          <NavGroup 
            key={group.title} 
            title={group.title} 
            items={group.items as NavGroupType['items']} 
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
