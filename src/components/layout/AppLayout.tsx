import { Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"

export default function AppLayout() {
  return (
    <SidebarProvider className="bg-[#F3F4F6] dark:bg-background">
      <AppSidebar />
      <SidebarInset className="m-2 md:m-4 md:ml-0 rounded-[2.5rem] bg-background shadow-xl overflow-hidden border-0">
        <main className="h-full overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}



