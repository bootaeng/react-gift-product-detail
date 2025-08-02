import { http, HttpResponse } from 'msw'

const mockProduct = {
  id: 1,
  name: '상품 이름',
  price: {
    sellingPrice: 9000,
  },
  imageURL: 'https://picsum.photos/id/237/150',
  brandInfo: {
    imageURL: 'https://picsum.photos/id/100/150',
    name: '브랜드 이름',
  },
}

export const handlers = [
  http.get('/api/products/ranking', () => {
    return HttpResponse.json({
      data: [mockProduct],
    })
  }),
]
