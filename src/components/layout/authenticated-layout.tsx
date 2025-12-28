import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useDirection } from '@/hooks/use-direction'
import { cn } from '@/lib/utils'
import { useUser } from '@/features/users/api/use-user'
import { Loader2 } from 'lucide-react'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const { isRTL } = useDirection()
  
  // Fetch user via TanStack Query (sole owner of server state)
  const { isLoading } = useUser()
  
  // Show loading state during initial data fetch
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  
  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-screen overflow-hidden">
      <AppSidebar />
      <div 
        className={cn(
          "flex-1 flex flex-col h-screen overflow-hidden transition-[width,margin] duration-200 ease-linear py-2",
          // RTL: padding on left, margin adjustment on right
          // LTR: padding on right, margin adjustment on left
          isRTL ? "pl-2 pr-1" : "pr-2 pl-1"
        )}
      >
        {children ? children : <Outlet />}
      </div>
    </SidebarProvider>
  )
}
