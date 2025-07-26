import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'

type AuthContextType = {
  user: { email: string; name: string } | null
  isLoggedIn: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

export const STORAGE_KEY_USER = 'userInfo'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<
    { email: string; name: string } | null | undefined
  >(undefined)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_USER)
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser({ email: parsed.email, name: parsed.name })
      localStorage.setItem('authToken', parsed.authToken)
    }
  }, [])

  const { mutate: login } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const res = await axios.post('/api/login', { email, password })
      return res.data.data
    },
    onSuccess: (data) => {
      const { authToken, email: userEmail, name } = data
      console.log('로그인 응답:', data)
      localStorage.setItem('authToken', authToken)
      const userInfo = { authToken, email: userEmail, name }
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userInfo))
      setUser({ email: userEmail, name })
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        if (status && status >= 400 && status < 500) {
          toast.error(
            error.response?.data?.message ||
              '아이디 또는 비밀번호가 올바르지 않습니다.'
          )
        } else {
          toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        }
      } else {
        toast.error('오류가 발생했습니다.')
      }
    },
  })

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY_USER)
    localStorage.removeItem('authToken')
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoggedIn: !!user,
        login: (email, password) => login({ email, password }),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuth는 AuthProvider 내에서만 사용해야 합니다.')
  return context
}

export default AuthProvider
