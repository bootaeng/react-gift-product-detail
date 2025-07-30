import { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import RankingItem from './RankingItem'
import { useRankingProducts } from './useRankingProducts'
import { PATHS } from '@/Root'
const filters = [
  { label: '전체', emoji: 'ALL' },
  { label: '여성이', emoji: '👩🏻' },
  { label: '남성이', emoji: '👨🏻' },
  { label: '청소년이', emoji: '👦🏻' },
]

const tabs = ['받고 싶어한', '많이 선물한', '위시로 받은']

type FilterLabel = '전체' | '여성이' | '남성이' | '청소년이'
type TabLabel = '받고 싶어한' | '많이 선물한' | '위시로 받은'

const filterToTargetType = (label: FilterLabel) => {
  switch (label) {
    case '전체':
      return 'ALL'
    case '여성이':
      return 'FEMALE'
    case '남성이':
      return 'MALE'
    case '청소년이':
      return 'TEEN'
    default:
      return 'ALL'
  }
}

const tabToRankType = (label: TabLabel) => {
  switch (label) {
    case '받고 싶어한':
      return 'MANY_WISH'
    case '많이 선물한':
      return 'MANY_RECEIVE'
    case '위시로 받은':
      return 'MANY_WISH_RECEIVE'
    default:
      return 'MANY_WISH'
  }
}

export const RankingSection = () => {
  const navigate = useNavigate()

  const [selectedFilter, setSelectedFilter] = useState<FilterLabel>(() => {
    return (localStorage.getItem('selectedFilter') as FilterLabel) || '전체'
  })

  const [selectedTab, setSelectedTab] = useState<TabLabel>(() => {
    return (localStorage.getItem('selectedTab') as TabLabel) || '받고 싶어한'
  })

  const { data, loading, error } = useRankingProducts(
    filterToTargetType(selectedFilter),
    tabToRankType(selectedTab)
  )

  const handleFilterChange = (label: FilterLabel) => {
    setSelectedFilter(label)
    localStorage.setItem('selectedFilter', label)
  }

  const handleTabChange = (tab: TabLabel) => {
    setSelectedTab(tab)
    localStorage.setItem('selectedTab', tab)
  }

  if (loading) return <Section>로딩 중...</Section>
  if (error) return <Section>{error}</Section>

  return (
    <Section>
      <Title>실시간 급상승 선물랭킹</Title>

      <FilterRow>
        {filters.map(({ emoji, label }) => (
          <Filter
            key={label}
            selected={label === selectedFilter}
            onClick={() => handleFilterChange(label as FilterLabel)}
          >
            <div className="emoji">{emoji}</div>
            <span>{label}</span>
          </Filter>
        ))}
      </FilterRow>

      <TabRow>
        {tabs.map((t) => (
          <Tab
            key={t}
            selected={t === selectedTab}
            onClick={() => handleTabChange(t as TabLabel)}
          >
            {t}
          </Tab>
        ))}
      </TabRow>

      <Grid>
        {data.length === 0 ? (
          <div>상품 목록이 없습니다.</div>
        ) : (
          data.map((item, idx) => (
            <RankingItem
              key={item.id}
              rank={idx + 1}
              image={item.imageURL}
              brand={item.brandInfo?.name || ''}
              name={item.name}
              price={item.price.sellingPrice}
              onClick={() =>
                navigate(
                  PATHS.PRODUCT_DETAIL.replace(':productId', String(item.id))
                )
              }
            />
          ))
        )}
      </Grid>
    </Section>
  )
}

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.spacing6};
`

const Title = styled.h3`
  ${({ theme }) => theme.typography.title2Bold};
  margin-bottom: ${({ theme }) => theme.spacing.spacing3};
`

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 16px;
`

const Filter = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px 0;

  .emoji {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background-color: ${({ selected, theme }) =>
      selected ? theme.colors.blue[600] : theme.colors.blue[100]};
    color: white;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 0.875rem;
    color: ${({ selected, theme }) =>
      selected ? theme.colors.blue[700] : theme.colors.gray[500]};
    font-weight: 500;
  }
`

const TabRow = styled.div`
  display: flex;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.blue[100] || '#f0f6ff'};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`

const Tab = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.spacing3} 0;
  font-size: 0.875rem;
  background: transparent;
  color: ${({ selected, theme }) =>
    selected ? theme.colors.blue[700] : theme.colors.gray[800]};
  font-weight: ${({ selected }) => (selected ? 700 : 500)};
  border: none;
  cursor: pointer;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.spacing2};
`
