import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  
  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden transition-[width,margin] duration-200 ease-linear py-2 pr-2 pl-1">
        {children ? children : <Outlet />}
      </div>
    </SidebarProvider>
  )
}
