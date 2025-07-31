import styled from '@emotion/styled'

type Props = {
  announcements: { name: string; value: string; displayOrder: number }[]
}

const ProductAnnouncement = ({ announcements }: Props) => {
  if (announcements.length === 0) return <div>상세정보 없음</div>

  return (
    <div>
      {announcements
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((a, i) => (
          <AnnouncementItem key={i}>
            <Title>{a.name}</Title>
            <Value>{a.value}</Value>
          </AnnouncementItem>
        ))}
    </div>
  )
}

export default ProductAnnouncement

const AnnouncementItem = styled.div`
  margin-bottom: 24px;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
`

const Value = styled.div`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
`
