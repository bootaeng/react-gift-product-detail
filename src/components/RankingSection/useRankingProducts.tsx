import { useEffect, useState } from 'react'
import type { Product } from '../../data/products'

export const useRankingProducts = (targetType: string, rankType: string) => {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!targetType || !rankType) {
      setData([])
      return
    }

    const fetchRanking = async () => {
      setLoading(true)
      setError(null)

      try {
        const url = `/api/products/ranking?targetType=${targetType}&rankType=${rankType}`

        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const json = await res.json()

        setData(json.data || [])
      } catch (err) {
        console.error(err)
        setError('데이터 로딩 실패')
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()
  }, [targetType, rankType])

  return { data, loading, error }
}
