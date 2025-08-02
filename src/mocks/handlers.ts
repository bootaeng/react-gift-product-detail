import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/products/ranking', ({ request }) => {
    const url = new URL(request.url)
    const forceError = url.searchParams.get('forceError')

    if (forceError) {
      return new HttpResponse('Server Error', { status: 500 })
    }

    return HttpResponse.json([
      {
        id: 1,
        imageURL: 'https://placehold.co/150x150',
        brandInfo: { name: '브랜드 이름' },
        name: '상품 이름',
        price: { sellingPrice: 9000 },
      },
    ])
  }),
]
