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
    <Card className="flex flex-col h-auto sm:h-full max-h-[calc(100vh-2rem)] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-2 sm:gap-4 shrink-0 border-b p-3 sm:p-6">
        {/* Left side: Sidebar toggle + Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger variant='outline' />
          <ModeToggle />
        </div>

        {/* Center: Title and description */}
        <div className={`flex-1 min-w-0 ${rtl ? 'text-right' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
          <CardTitle className="text-base sm:text-lg truncate">{title}</CardTitle>
          {description && (
            <CardDescription className="hidden sm:block">{description}</CardDescription>
          )}
        </div>

        {/* Right side: Optional header actions */}
        {headerActions && (
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {headerActions}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-3 sm:p-6">
        {children}
      </CardContent>
    </Card>
  )
}

