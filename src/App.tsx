import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Layout } from '@/components/layout/Layout'
import { AuthProvider } from '@/components/auth'
import Dashboard from '@/pages/Dashboard'
import Today from '@/pages/Today'
import Planning from '@/pages/Planning'
import Review from '@/pages/Review'
import Notifications from '@/pages/Notifications'
import Settings from '@/pages/Settings'
import Commute from '@/pages/Commute'
import Templates from '@/pages/Templates'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isTokenValid = useAuthStore((s) => s.isTokenValid)
  const logout = useAuthStore((s) => s.logout)

  const tokenValid = isTokenValid()
  const isValid = isAuthenticated && tokenValid

  useEffect(() => {
    // 토큰이 만료되었으면 로그아웃 처리 (useEffect 내에서 상태 변경)
    if (isAuthenticated && !tokenValid) {
      console.log('Token expired, logging out...')
      logout()
    }
  }, [isAuthenticated, tokenValid, logout])

  return isValid ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="today" element={<Today />} />
          <Route path="planning" element={<Planning />} />
          <Route path="review" element={<Review />} />
          <Route path="review/:weekStartDate" element={<Review />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="templates" element={<Templates />} />
          <Route path="commute" element={<Commute />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
