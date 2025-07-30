import React from 'react'

type Props = {
  announcements: { name: string; value: string; displayOrder: number }[]
}

const ProductAnnouncement = ({ announcements }: Props) => {
  if (!announcements || announcements.length === 0)
    return <div>상세정보 없음</div>

  return (
    <div>
      {announcements
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((a, i) => (
          <div key={i} style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#333',
                marginBottom: '8px',
              }}
            >
              {a.name}
            </div>
            <div
              style={{
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {a.value}
            </div>
          </div>
        ))}
    </div>
  )
}

export default ProductAnnouncement
