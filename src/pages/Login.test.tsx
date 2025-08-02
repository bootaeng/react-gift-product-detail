import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/tests/test-utils'
import LoginPage from './LoginPage'
import * as AuthModule from '@/contexts/AuthContext'
import { vi } from 'vitest'

const mockLogin = vi.fn()

function setup() {
  vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
    user: null,
    isLoggedIn: false,
    login: mockLogin,
    logout: vi.fn(),
  })
  renderWithProviders(<LoginPage />)
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('이메일과 비밀번호 입력 필드가 렌더링된다', () => {
    setup()
    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument()
  })

  it('@kakao.com 형식 이메일과 8자리 이상 비밀번호를 입력하면 로그인 성공', async () => {
    setup()
    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'user@kakao.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password' },
    })
    fireEvent.click(screen.getByRole('button', { name: /로그인/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })
  })
})
