import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import styled from '@emotion/styled'

const MyPageWrapper = styled.main`
  padding: 40px 20px;
  max-width: 600px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
`

const Greeting = styled.p`
  margin-bottom: 8px;
  font-size: 16px;
`

const Email = styled.p`
  margin-bottom: 32px;
  font-size: 16px;
`

const LogoutButton = styled.button`
  background: #eee;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Layout>
      <MyPageWrapper>
        <Title>마이 페이지</Title>
        <Greeting>{user?.name}님 하세요!</Greeting>
        <Email>이메일 주소는 {user?.email}입니다.</Email>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </MyPageWrapper>
    </Layout>
  )
}
