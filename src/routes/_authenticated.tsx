import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/features/auth"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
  },
  component: () => <Outlet />,
})
