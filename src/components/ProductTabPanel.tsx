import React, { Suspense, lazy } from 'react'
import { TabContent, DescriptionWrapper } from '@/styles/detail'
import ErrorBoundary from '@/components/ErrorBoundary'

const ProductReview = lazy(() => import('./ProductReview'))
const ProductAnnouncement = lazy(() => import('./ProductAnnouncement'))

interface ProductTabPanelProps {
  selectedTab: number
  detail?: {
    description: string
    announcements: { name: string; value: string; displayOrder: number }[]
  }
  highlightReview?: {
    reviews: { id: number; authorName: string; content: string }[]
  }
}

const ProductTabPanel = ({
  selectedTab,
  detail,
  highlightReview,
}: ProductTabPanelProps) => {
  return (
    <TabContent>
      {selectedTab === 0 && detail && (
        <DescriptionWrapper>
          <div
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
        </DescriptionWrapper>
      )}

      {selectedTab === 1 && (
        <ErrorBoundary>
          <Suspense fallback={<div>후기 로딩 중...</div>}>
            {highlightReview ? (
              <ProductReview reviews={highlightReview.reviews} />
            ) : (
              <div>후기 로딩 중...</div>
            )}
          </Suspense>
        </ErrorBoundary>
      )}

      {selectedTab === 2 && detail && (
        <ErrorBoundary>
          <Suspense fallback={<div>상세정보 로딩 중...</div>}>
            <ProductAnnouncement announcements={detail.announcements} />
          </Suspense>
        </ErrorBoundary>
      )}
    </TabContent>
  )
}

export default ProductTabPanel
