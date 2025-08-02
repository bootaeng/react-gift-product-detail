import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginPage from './LoginPage'
import * as AuthModule from '@/contexts/AuthContext'

const mockLogin = vi.fn()

function renderLoginPage() {
  vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
    user: null,
    isLoggedIn: false,
    login: mockLogin,
    logout: vi.fn(),
  })

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('이메일과 비밀번호 입력 필드가 렌더링된다', () => {
    renderLoginPage()

    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument()
  })

  it('@kakao.com 형식 이메일과 8자리 이상 비밀번호를 입력하면 로그인 성공', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'user@kakao.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password' },
    })

    fireEvent.click(screen.getByRole('button', { name: /로그인/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@kakao.com',
        password: 'password',
      })
    })
  })

  it('잘못된 이메일 형식이면 로그인 시도 안 함', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'user@gmail.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password' },
    })

    fireEvent.click(screen.getByRole('button', { name: /로그인/i }))

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it('비밀번호가 8자리 미만이면 로그인 시도 안 함', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'user@kakao.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: '1234567' },
    })

    fireEvent.click(screen.getByRole('button', { name: /로그인/i }))

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })
})
