import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PATHS } from '@/Root'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth()
  const location = useLocation()

  if (user === undefined) {
    return null
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location }} />
  }

  return <>{children}</>
}

export default ProtectedRoute
