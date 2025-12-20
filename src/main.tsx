import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StudentsPage from './pages/StudentsPage.tsx'
import ExamsPage from './pages/ExamsPage.tsx'
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'
import { createRootRoute, createRoute } from '@tanstack/react-router'
import AppLayout from './components/layout/AppLayout.tsx'

const rootRoute = createRootRoute({ component: AppLayout })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: ExamsPage })
const examsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/exams', component: ExamsPage })
const studentsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/students', component: StudentsPage })

const routeTree = rootRoute.addChildren([indexRoute, examsRoute, studentsRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

import { ThemeProvider } from './components/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
