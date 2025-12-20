import { Outlet } from '@tanstack/react-router'
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

function AppLayoutContent() {
  const { state, isMobile } = useSidebar()
  
  // On mobile, the sidebar is a sheet, so we don't need margin.
  // On desktop, we need margin equal to the sidebar width.
  const marginLeft = isMobile ? "0px" : (state === "expanded" ? "var(--sidebar-width)" : "var(--sidebar-width-icon)")

  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6] dark:bg-background overflow-hidden">
      <AppSidebar />
      <div 
        className="flex-1 transition-[margin] duration-200 ease-linear overflow-hidden"
        style={{ marginLeft }}
      >
        <SidebarInset className="h-full m-0 rounded-none bg-transparent">
          <div className="h-full flex flex-col p-2 md:p-4">
            <header className="flex h-12 shrink-0 items-center px-4 gap-2">
              <SidebarTrigger className="-ml-1" />
            </header>
            <main className="flex-1 bg-background rounded-[2.5rem] shadow-xl overflow-y-auto p-4 md:p-8">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
      </div>
    </div>
  )
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppLayoutContent />
    </SidebarProvider>
  )
}



