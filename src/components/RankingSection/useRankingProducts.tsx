import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '../../data/products'

const ApiClient = {
  get: async <T = any,>(url: string, config?: any): Promise<T> => {
    const res = await axios.get(url, config)
    return res.data.data ?? res.data
  },
}

const fetchRanking = async (
  targetType: string,
  rankType: string
): Promise<Product[]> => {
  return ApiClient.get<Product[]>('/api/products/ranking', {
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
