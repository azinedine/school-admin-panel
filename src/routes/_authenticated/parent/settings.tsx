import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'
// We might need to extract the SettingsPage component from the route file if it's not exported default
// For now, let's create a placeholder or try to import if possible.
// Use existing SettingsPage logic... reusing code by copy-paste for now to ensure isolation as requested "Strict RBAC" layout usually implies distinct pages.
// But refactoring SettingsPage to a shared component is better.
// I will start with a placeholder that redirects to the shared settings or replicate it?
// The user asked for clean RBAC.
// I will use a simple placeholder for now to prove structure.

export const Route = createFileRoute('/_authenticated/parent/settings')({
  component: () => (
    <ContentPage title="Settings" description="Manage your profile and preferences">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Settings page coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
