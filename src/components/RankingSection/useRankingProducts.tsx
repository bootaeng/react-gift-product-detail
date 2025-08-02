import { useQuery } from '@tanstack/react-query'
import type { Product } from '../../data/products'
import { apiClient } from '@/lib/apiClient'
import { useState, useEffect } from 'react'

const fetchRanking = async (
  targetType: string,
  rankType: string
): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>('/products/ranking', {
    params: { targetType, rankType },
  })
  return res ?? []
}

export const useRankingProducts = (targetType: string, rankType: string) => {
  const searchParams = new URLSearchParams(window.location.search)
  const forceError = searchParams.get('forceError')

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/products/ranking?targetType=${targetType}&rankType=${rankType}${forceError ? '&forceError=true' : ''}`
        )
        if (!res.ok) throw new Error()
        const json = await res.json()
        setData(json)
      } catch {
        setHasError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [targetType, rankType, forceError])

  return { data, loading, hasError }
}
