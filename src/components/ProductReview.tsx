import styled from '@emotion/styled'

type Props = {
  reviews: { id: number; authorName: string; content: string }[]
}

const ProductReview = ({ reviews }: Props) => {
  if (reviews.length === 0) return <div>후기 없음</div>

  return (
    <div>
      {reviews.map((r) => (
        <ReviewItem key={r.id}>
          <AuthorName>{r.authorName}</AuthorName>
          <Content>{r.content}</Content>
        </ReviewItem>
      ))}
    </div>
  )
}

export default ProductReview

const ReviewItem = styled.div`
  margin-bottom: 20px;
`

const AuthorName = styled.strong`
  font-size: 14px;
  color: #333;
`

const Content = styled.p`
  margin: 8px 0 0 0;
  color: #666;
  line-height: 1.5;
`
