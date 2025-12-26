import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/teacher')({
  beforeLoad: () => {
     // Role check handled globally by RBAC system
  },
  component: Outlet,
  notFoundComponent: () => <Navigate to="/unauthorized" />,
})
