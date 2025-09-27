import { AdminPanel } from "@/components/admin/AdminPanel"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPanel />
    </ProtectedRoute>
  )
}
