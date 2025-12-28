import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Layout } from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Today from '@/pages/Today'
import Planning from '@/pages/Planning'
import Review from '@/pages/Review'
import Notifications from '@/pages/Notifications'
import Settings from '@/pages/Settings'
import Commute from '@/pages/Commute'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { useEffect } from 'react'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    console.log('PrivateRoute - isAuthenticated:', isAuthenticated)
  }, [isAuthenticated])

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    console.log('PublicRoute - isAuthenticated:', isAuthenticated)
  }, [isAuthenticated])

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
  return (
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
          <Route path="commute" element={<Commute />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
