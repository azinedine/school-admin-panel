import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import StudentsPage from './pages/StudentsPage.tsx'
import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'
import { createRootRoute, createRoute } from '@tanstack/react-router'
import AppLayout from './components/layout/AppLayout.tsx'

const rootRoute = createRootRoute({ component: AppLayout })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: App })
const studentsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/students', component: StudentsPage })

const routeTree = rootRoute.addChildren([indexRoute, studentsRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
