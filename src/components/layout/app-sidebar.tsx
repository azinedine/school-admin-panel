import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Files,
  Newspaper,
  Activity,
  Zap,
  Settings
} from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import mirsadLogoDark from "@/assets/mirsad-logo.png"
import mirsadLogoLight from "@/assets/mirsad-logo-white.png"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mainItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Class Preparation", url: "/prep", icon: ClipboardCheck },
  { title: "Attendance", url: "/attendance", icon: FileText },
  { title: "Exams", url: "/exams", icon: BookOpen },
  { title: "Assignment management", url: "/assignments", icon: FileText },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "Students", url: "/students", icon: Users },
  { title: "Messages", url: "/messages", icon: MessageSquare, badge: "2" },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: Files },
]

const settingItems = [
  { title: "School News", url: "/news", icon: Newspaper },
  { title: "School Activities", url: "/activities", icon: Activity },
  { title: "What's New", url: "/updates", icon: Zap },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0">
      <SidebarHeader className="h-20 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:hidden">
          <div className="relative h-10 w-10 shrink-0">
            <img 
              src={mirsadLogoDark}
              alt="Mirsad Logo" 
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-in-out ${
                currentTheme === 'dark' ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <img 
              src={mirsadLogoLight}
              alt="Mirsad Logo" 
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-in-out ${
                currentTheme === 'light' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <span className="font-bold text-xl tracking-tight truncate">
            Mirsad
          </span>
        </div>
        <SidebarTrigger className="shrink-0" />
      </SidebarHeader>
      
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Main menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-accent/50 rounded-xl h-11 px-4">
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Settings and news
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-accent/50 rounded-xl h-11 px-4">
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-accent/20">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate">Amirbaqian</span>
            <span className="text-[11px] text-muted-foreground truncate">Teacher</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
