import { renderWithProviders } from '../../tests/test-utils'
import { screen, waitFor } from '@testing-library/react'
import { RankingSection } from './RankingSection'

describe('RankingSection', () => {
  it('API에서 받은 상품이 화면에 렌더링된다', async () => {
    renderWithProviders(<RankingSection />)

    expect(await screen.findByText('상품 이름')).toBeInTheDocument()
    expect(screen.getByText('브랜드 이름')).toBeInTheDocument()
  })

  it('API 호출 실패 시 에러 메시지를 표시한다', async () => {
    window.history.pushState({}, '', '/?forceError=true')

    renderWithProviders(<RankingSection />)

    await waitFor(() => {
      expect(screen.getByText(/불러오기 실패/i)).toBeInTheDocument()
    })
  })
})
