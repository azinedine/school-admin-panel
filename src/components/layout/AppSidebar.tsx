import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

type NavItem = {
  to: string
  label: string
}

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard" },
  { to: "/students", label: "Students" },
]

export function AppSidebar() {
  const { location } = useRouterState()
  const pathname = location.pathname

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 border-r bg-card/40">
      <div className="h-16 flex items-center px-4 border-b">
        <span className="text-lg font-semibold">School Admin</span>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.to
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground">
        © {new Date().getFullYear()} School Admin
      </div>
    </aside>
  )
}



