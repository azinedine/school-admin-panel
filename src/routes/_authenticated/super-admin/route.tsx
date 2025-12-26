import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/super-admin')({
  beforeLoad: () => {
    // Role check handled globally by RBAC system
  },
  component: Outlet,
  notFoundComponent: () => <Navigate to="/unauthorized" />,
})
