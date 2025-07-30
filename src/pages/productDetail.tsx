import { useParams, useNavigate, generatePath } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, Suspense, lazy } from 'react'
import { apiClient } from '@/lib/apiClient'
import { PATHS } from '@/Root'
import Layout from '@/components/Layout'
import { Heart } from 'lucide-react'
import ErrorBoundary from '@/components/ErrorBoundary'

const ProductReview = lazy(() => import('../components/ProductReview'))
const ProductAnnouncement = lazy(
  () => import('../components/ProductAnnouncement')
)

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

  const {
    data: detail,
    isLoading: detailLoading,
    error: detailError,
  } = useQuery({
    queryKey: ['productDetailInfo', productId],
    queryFn: () => apiClient.get(`/products/${productId}/detail`),
    enabled: !!productId,
  })

  const { data: highlightReview } = useQuery({
    queryKey: ['productReview', productId],
    queryFn: () => apiClient.get(`/products/${productId}/highlight-review`),
    enabled: !!productId,
  })

  const { data: wishData } = useQuery({
    queryKey: ['wishCount', productId],
    queryFn: () => apiClient.get(`/products/${productId}/wish`),
    enabled: !!productId,
  })

  useEffect(() => {
    const savedWishData = localStorage.getItem(`wish_${productId}`)
    if (savedWishData) {
      const { wished: savedWished, wishCount: savedWishCount } =
        JSON.parse(savedWishData)
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

  const handleWishToggle = () => {
    const newWished = !wished
    const newWishCount = newWished ? wishCount + 1 : Math.max(0, wishCount - 1)

    setWished(newWished)
    setWishCount(newWishCount)

    localStorage.setItem(
      `wish_${productId}`,
      JSON.stringify({ wished: newWished, wishCount: newWishCount })
    )
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
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ width: '100%', height: 'auto' }}>
          {product?.imageURL ? (
            <img
              src={product.imageURL}
              alt={product.name}
              style={{ width: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div
              style={{ width: '100%', height: '240px', background: '#eee' }}
            />
          )}
        </div>

        <div style={{ padding: '1rem' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            {product.name}
          </h2>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {product.price?.sellingPrice.toLocaleString()}원
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={product.brandInfo?.imageURL}
              alt={product.brandInfo?.name}
              width={20}
              height={20}
            />
            <span style={{ fontSize: 14 }}>{product.brandInfo?.name}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            borderBottom: '1px solid #ddd',
          }}
        >
          {TAB_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setSelectedTab(i)}
              style={{
                padding: '1rem',
                fontWeight: selectedTab === i ? 'bold' : 'normal',
                borderBottom: selectedTab === i ? '2px solid black' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: '1rem', textAlign: 'left' }}>
          {selectedTab === 0 && detail && (
            <div style={{ overflowX: 'auto' }}>
              <div
                style={{ minWidth: '100%', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{
                  __html: `
                    <style>
                      img, iframe, video {
                        max-width: 100%;
                        height: auto;
                      }
                      table {
                        width: 100% !important;
                        border-collapse: collapse;
                      }
                      * {
                        box-sizing: border-box;
                      }
                    </style>
                    ${detail.description}
                  `,
                }}
              />
            </div>
          )}

          {selectedTab === 1 && (
            <ErrorBoundary>
              <Suspense fallback={<div>후기 로딩 중...</div>}>
                <ProductReview reviews={highlightReview?.reviews || []} />
              </Suspense>
            </ErrorBoundary>
          )}

          {selectedTab === 2 && (
            <ErrorBoundary>
              <Suspense fallback={<div>상세정보 로딩 중...</div>}>
                <ProductAnnouncement
                  announcements={detail?.announcements || []}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          display: 'flex',
          height: '55px',
          borderTop: '1px solid #eee',
          backgroundColor: '#fff',
          maxWidth: '750px',
          margin: '0 auto',
          left: 0,
          right: 0,
        }}
      >
        <button
          style={{
            flex: 1,
            border: 'none',
            background: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.5rem',
            cursor: 'pointer',
          }}
          onClick={handleWishToggle}
        >
          <Heart
            color={wished ? 'red' : 'black'}
            fill={wished ? 'red' : 'none'}
            size={20}
          />
          <span style={{ fontSize: '12px', marginTop: '2px' }}>
            {wishCount}
          </span>
        </button>
        <button
          style={{
            flex: 4,
            backgroundColor: '#ffeb00',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={handleOrderClick}
        >
          주문하기
        </button>
      </div>
    </Layout>
  )
}

export default ProductDetailPage
