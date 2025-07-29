import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import MyPage from './pages/MyPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import OrderPage from './pages/OrderPage'
import { CategoryItem } from './pages/CategoryItem'
export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  NOT_FOUND: '*',
  ORDER: '/order/:productId',
  MY: '/my',
  CATEGORY: '/category/:themeId',
} as const
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const authProtected = (element: React.ReactNode) => (
  <ProtectedRoute>{element}</ProtectedRoute>
)
const router = createBrowserRouter([
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.HOME,
    element: <App />,
  },
  {
    path: PATHS.ORDER,
    element: authProtected(<OrderPage />),
  },
  {
    path: PATHS.MY,
    element: authProtected(<MyPage />),
  },
  {
    path: PATHS.NOT_FOUND,
    element: <NotFoundPage />,
  },
  { path: PATHS.CATEGORY, element: <CategoryItem /> },
])

const Root = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <>
            <ToastContainer
              position="bottom-center"
              autoClose={2000}
              hideProgressBar
              theme="colored"
            />
            <RouterProvider router={router} />
          </>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export default Root
