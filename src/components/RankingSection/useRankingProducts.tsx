import { useQuery } from '@tanstack/react-query'
import type { Product } from '../../data/products'
import { apiClient } from '@/lib/apiClient'

const fetchRanking = async (
  targetType: string,
  rankType: string
): Promise<Product[]> => {
  return apiClient.get<Product[]>('/products/ranking', {
    params: { targetType, rankType },
  })
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
    hasError: !!error,
  }
}
