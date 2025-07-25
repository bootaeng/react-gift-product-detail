<<<<<<< HEAD
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
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

>>>>>>> 5628913b9fe5647f65c620d00b2b3d263d7fd596
export default App
