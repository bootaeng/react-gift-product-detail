import React from 'react'

type Props = {
  reviews: { id: number; authorName: string; content: string }[]
}

const ProductReview = ({ reviews }: Props) => {
  if (!reviews || reviews.length === 0) return <div>후기 없음</div>

  return (
    <div>
      {reviews.map((r) => (
        <div key={r.id} style={{ marginBottom: '20px' }}>
          <strong style={{ fontSize: '14px', color: '#333' }}>
            {r.authorName}
          </strong>
          <p style={{ margin: '8px 0 0 0', color: '#666', lineHeight: '1.5' }}>
            {r.content}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ProductReview
