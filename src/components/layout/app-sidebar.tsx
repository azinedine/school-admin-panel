import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { sidebarData } from './data/sidebar-data'
import type { NavGroup as NavGroupType } from './types'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Use sidebar data or fallback to default
  const userData = {
    name: sidebarData.user.name,
    email: sidebarData.user.email,
    avatar: sidebarData.user.avatar,
  }

  return (
    <Sidebar collapsible='icon' variant='floating' side='right' {...props}>
      <SidebarHeader>
        <div className='flex items-center justify-between gap-2'>
          <TeamSwitcher teams={sidebarData.teams} />
          <LanguageSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <NavGroup 
            key={group.title} 
            title={group.title} 
            items={group.items as NavGroupType['items']} 
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
