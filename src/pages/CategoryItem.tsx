import { useParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useEffect } from 'react'
import { apiClient } from '@/lib/apiClient'
import RankingItem from '../components/RankingSection/RankingItem'
import Layout from '../components/Layout'
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

interface ProductListResponse {
  list: Product[]
  cursor: number
  hasMoreList: boolean
}

export const CategoryItem = () => {
  const { themeId } = useParams()
  const navigate = useNavigate()
  const observerRef = useRef(null)

  const {
    data: themeInfo,
    isLoading: isThemeLoading,
    isError: isThemeError,
    error: themeError,
  } = useQuery<ThemeInfo>({
    queryKey: ['themeInfo', themeId],
    queryFn: async () => {
      return apiClient.get(`/themes/${themeId}/info`)
    },
    enabled: !!themeId,
    retry: false,
  })

  useEffect(() => {
    if (themeError && (themeError as any)?.response?.status === 404) {
      navigate(PATHS.HOME)
    }
  }, [themeError, navigate])

  const {
    data: productPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductListResponse>({
    queryKey: ['themeProducts', themeId],
    queryFn: async ({ pageParam = 0 }) => {
      return apiClient.get(`/themes/${themeId}/products`, {
        params: { cursor: pageParam, limit: 10 },
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMoreList ? lastPage.cursor : undefined,
    enabled: !!themeId,
  })

  useEffect(() => {
    const el = observerRef.current
    if (!el || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isThemeLoading) return <Wrapper>로딩 중...</Wrapper>
  if (isThemeError || !themeInfo) return <Wrapper>오류 발생</Wrapper>

  const allProducts = productPages?.pages.flatMap((page) => page.list) || []

  return (
    <Layout>
      <Wrapper
        style={{ backgroundColor: themeInfo.backgroundColor || '#ffffff' }}
      >
        <Title>{themeInfo.name}</Title>
        <Description>{themeInfo.title}</Description>
      </Wrapper>

      <Grid>
        {allProducts.map((product, index) => (
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
