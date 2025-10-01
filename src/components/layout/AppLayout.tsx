import { Outlet } from '@tanstack/react-router'
import { AppSidebar } from './AppSidebar'

export default function AppLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      <AppSidebar />
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    </div>
  )
}



