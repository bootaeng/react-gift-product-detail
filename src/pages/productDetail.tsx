import { useParams, useNavigate, generatePath } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/apiClient'
import { PATHS } from '@/Root'
import Layout from '@/components/Layout'
import ProductSummary from '@/components/ProductSummary'
import ProductTabPanel from '@/components/ProductTabPanel'
import {
  PageWrapper,
  TabBar,
  TabButton,
  BottomBar,
  WishButton,
  WishCount,
  OrderButton,
} from '@/styles/detail'
import { Heart } from 'lucide-react'

const TAB_LABELS = ['상품설명', '선물후기', '상세정보']

const ProductDetailPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(0)
  const [wishCount, setWishCount] = useState(0)
  const [wished, setWished] = useState(false)

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => apiClient.get(`/products/${productId}`),
    enabled: !!productId,
  })

  const { data: detail } = useQuery({
    queryKey: ['productDetailInfo', productId],
    queryFn: () => apiClient.get(`/products/${productId}/detail`),
    enabled: !!productId,
  })

  const { data: highlightReview } = useQuery({
    queryKey: ['productReview', productId],
    queryFn: () => apiClient.get(`/products/${productId}/highlight-review`),
    enabled: !!productId && selectedTab === 1,
  })

  const { data: wishData } = useQuery({
    queryKey: ['wishCount', productId],
    queryFn: () => apiClient.get(`/products/${productId}/wish`),
    enabled: !!productId,
  })

  useEffect(() => {
    const saved = localStorage.getItem(`wish_${productId}`)
    if (saved) {
      const { wished: savedWished, wishCount: savedWishCount } =
        JSON.parse(saved)
      setWished(savedWished)
      setWishCount(savedWishCount)
    }
  }, [productId])

  useEffect(() => {
    if (wishData && !localStorage.getItem(`wish_${productId}`)) {
      setWishCount(wishData.wishCount)
      setWished(wishData.isWished)
    }
  }, [wishData, productId])

  const mockToggleWishApi = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.3
        success ? resolve() : reject(new Error('요청 실패: 서버 오류'))
      }, 1000)
    })
  }

  const handleWishToggle = async () => {
    const prevWished = wished
    const prevWishCount = wishCount

    const newWished = !wished
    const newWishCount = newWished ? wishCount + 1 : Math.max(0, wishCount - 1)

    setWished(newWished)
    setWishCount(newWishCount)
    localStorage.setItem(
      `wish_${productId}`,
      JSON.stringify({ wished: newWished, wishCount: newWishCount })
    )

    try {
      await mockToggleWishApi()
    } catch (error) {
      alert('다시 시도해주세요.')
      setWished(prevWished)
      setWishCount(prevWishCount)
      localStorage.setItem(
        `wish_${productId}`,
        JSON.stringify({ wished: prevWished, wishCount: prevWishCount })
      )
    }
  }

  const handleOrderClick = () => {
    if (!product?.id) return
    const path = generatePath(PATHS.ORDER, { productId: String(product.id) })
    navigate(path)
  }

  if (isLoading)
    return (
      <Layout>
        <div>로딩 중...</div>
      </Layout>
    )
  if (isError)
    return (
      <Layout>
        <div>{(error as Error).message}</div>
      </Layout>
    )

  return (
    <Layout>
      <PageWrapper>
        <ProductSummary product={product} />

        <TabBar>
          {TAB_LABELS.map((label, i) => (
            <TabButton
              key={label}
              selected={selectedTab === i}
              onClick={() => setSelectedTab(i)}
            >
              {label}
            </TabButton>
          ))}
        </TabBar>

        <ProductTabPanel
          selectedTab={selectedTab}
          detail={detail}
          highlightReview={highlightReview}
        />
      </PageWrapper>

      <BottomBar>
        <WishButton onClick={handleWishToggle}>
          <Heart
            color={wished ? 'red' : 'black'}
            fill={wished ? 'red' : 'none'}
            size={20}
          />
          <WishCount>{wishCount}</WishCount>
        </WishButton>
        <OrderButton onClick={handleOrderClick}>주문하기</OrderButton>
      </BottomBar>
    </Layout>
  )
}

export default ProductDetailPage
