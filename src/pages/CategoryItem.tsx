import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import RankingItem from '../components/RankingSection/RankingItem'
import Layout from '../components/Layout'
import axios from 'axios'
import { PATHS } from '@/Root'

const Wrapper = styled.section`
  padding: ${({ theme }) => theme.spacing.spacing5};
`

const Title = styled.h2`
  ${({ theme }) => theme.typography.body1Regular};
  margin-bottom: ${({ theme }) => theme.spacing.spacing6};
`

const Description = styled.p`
  ${({ theme }) => theme.typography.title1Bold};
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`

const Grid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.spacing4};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.spacing4};
`
interface ThemeInfo {
  name: string
  title: string
  backgroundColor?: string
}

interface Product {
  id: number
  name: string
  imageURL: string
  price: {
    sellingPrice: number
  }
  brandInfo?: {
    name?: string
  }
}
export const CategoryItem = () => {
  const { themeId } = useParams()
  const navigate = useNavigate()

  const [themeInfo, setThemeInfo] = useState<ThemeInfo | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cursor, setCursor] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef(null)

  const loadMore = useCallback(async () => {
    if (!themeId || isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const res = await axios.get(`/api/themes/${themeId}/products`, {
        params: { cursor, limit: 10 },
      })
      const data = res.data.data
      setProducts((prev) => [...prev, ...data.list])
      setCursor(data.cursor)
      setHasMore(data.hasMoreList)
    } catch (err) {
      console.error('loadMore error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [themeId, cursor, isLoading, hasMore])

  useEffect(() => {
    if (!themeId) return

    const fetchTheme = async () => {
      try {
        const res = await axios.get(`/api/themes/${themeId}/info`)
        setThemeInfo(res.data.data)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate(PATHS.HOME)
        } else {
          console.error(error)
        }
      }
    }

    fetchTheme()
    loadMore()
  }, [themeId, loadMore, navigate])

  useEffect(() => {
    const el = observerRef.current
    if (!el || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.0 }
    )

    observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [hasMore, isLoading])

  if (!themeInfo) return <Wrapper>로딩 중...</Wrapper>

  return (
    <Layout>
      <Wrapper
        style={{ backgroundColor: themeInfo.backgroundColor || '#ffffff' }}
      >
        <Title>{themeInfo.name}</Title>
        <Description>{themeInfo.title}</Description>
      </Wrapper>

      <Grid>
        {products.map((product, index) => (
          <RankingItem
            key={product.id}
            rank={index + 1}
            image={product.imageURL}
            brand={product.brandInfo?.name || ''}
            name={product.name}
            price={product.price.sellingPrice}
            onClick={() => navigate(`/order/${product.id}`)}
          />
        ))}
      </Grid>

      <div ref={observerRef} style={{ height: 40 }} />
    </Layout>
  )
}
