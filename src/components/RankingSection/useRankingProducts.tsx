import { useQuery } from '@tanstack/react-query'
import type { Product } from '../../data/products'

const fetchRanking = async (
  targetType: string,
  rankType: string
): Promise<Product[]> => {
  const url = `/api/products/ranking?targetType=${targetType}&rankType=${rankType}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  const json = await res.json()
  return json.data || []
}

export const useRankingProducts = (targetType: string, rankType: string) => {
  const enabled = Boolean(targetType && rankType)

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rankingProducts', targetType, rankType],
    queryFn: () => fetchRanking(targetType, rankType),
    enabled,
  })

  return {
    data,
    loading: isLoading,
    error: error ? '데이터 로딩 실패' : null,
  }
}
