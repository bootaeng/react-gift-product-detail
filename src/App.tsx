import { Layout } from '@/components/Layout'
import styled from '@emotion/styled'
import GiftFriendSelector from '@/components/GiftFriendSelector'
import { HomeContentCard } from '@/components/HomeContentCard'
import { RankingSection } from '@/components/RankingSection/RankingSection'
import { MotivationBanner } from '@/components/MotivationBanner'
import { CategorySection } from '@/components/CategorySection/CategorySection'
import './App.css'

const AppWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  display: flex;
  justify-content: center;
`

function App() {
  return (
    <AppWrapper>
      <Layout>
        <main>
          <GiftFriendSelector />
          <HomeContentCard>
            <CategorySection />
            <MotivationBanner />
            <RankingSection />
          </HomeContentCard>
        </main>
      </Layout>
    </AppWrapper>
  )
}
export default App
