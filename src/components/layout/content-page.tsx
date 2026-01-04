import type React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface ContentPageProps {
  /**
   * Page title displayed in the header
   */
  title: string
  /**
   * Optional description displayed below the title
   */
  description?: string
  /**
   * Content to render inside the page
   */
  children: React.ReactNode
  /**
   * Optional: Set to true for RTL layout (Arabic text alignment)
   */
  rtl?: boolean
  /**
   * Optional: Additional actions to display in the header (right side for LTR, left side for RTL)
   */
  headerActions?: React.ReactNode
}

/**
 * Reusable content page component with consistent layout.
 * Includes sidebar trigger, theme toggle, title, description, and scrollable content area.
 */
export function ContentPage({
  title,
  description,
  children,
  rtl = false,
  headerActions
}: ContentPageProps) {
  return (
    <Card className="flex flex-col h-auto sm:h-full max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-1 sm:gap-4 shrink-0 border-b py-2 px-2 sm:p-6">
        {/* Left side: Sidebar toggle + Theme toggle */}
        <div className="flex items-center gap-1 sm:gap-3">
          <SidebarTrigger variant='outline' className="h-8 w-8 sm:h-9 sm:w-9" />
          <ModeToggle />
        </div>

        {/* Center: Title and description */}
        <div className={`flex-1 min-w-0 ${rtl ? 'text-right' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
          <CardTitle className="text-sm sm:text-lg truncate leading-tight">{title}</CardTitle>
          {description && (
            <CardDescription className="hidden md:block text-xs sm:text-sm truncate">{description}</CardDescription>
          )}
        </div>

        {/* Right side: Optional header actions */}
        {headerActions && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {headerActions}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-2 sm:p-6">
        {children}
      </CardContent>
    </Card>
  )
}
