import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RankingSection } from './RankingSection'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('RankingSection', () => {
  it('API에서 받은 상품이 화면에 렌더링된다', async () => {
    render(
      <MemoryRouter>
        <RankingSection />
      </MemoryRouter>
    )

    expect(await screen.findByText('상품 이름')).toBeInTheDocument()

    expect(await screen.findByText(/9,000원/)).toBeInTheDocument()

    expect(await screen.findByText('브랜드 이름')).toBeInTheDocument()

    const productImage = screen.getByAltText('상품 이름')
    expect(productImage).toHaveAttribute(
      'src',
      'https://picsum.photos/id/237/150'
    )

    // 브랜드 이미지 확인
    const brandImage = screen.getByAltText('브랜드 이름')
    expect(brandImage).toHaveAttribute(
      'src',
      'https://picsum.photos/id/100/150'
    )
  })

  it('API 호출 실패 시 에러 메시지를 표시한다', async () => {
    server.use(
      http.get('/api/products/ranking', () => {
        return HttpResponse.json({ message: '서버 오류' }, { status: 500 })
      })
    )

    render(
      <MemoryRouter>
        <RankingSection />
      </MemoryRouter>
    )

    expect(await screen.findByText(/오류|불러오기 실패/i)).toBeInTheDocument()
  })
})
