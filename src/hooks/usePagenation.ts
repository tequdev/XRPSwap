'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const usePagenation = () => {
  const router = useRouter()
  const param = useSearchParams()
  const queryPage = param.get('page')
  const page = queryPage && !isNaN(parseInt(queryPage)) ? parseInt(queryPage) : 1

  const next = useCallback(() => {
    const nextPage = page + 1
    const param = new URLSearchParams()
    param.set('page', nextPage.toString())
    router.replace(`/tokens?${param}`)
  }, [page, router])

  const prev = useCallback(() => {
    const prevPage = page - 1
    const param = new URLSearchParams()
    param.set('page', prevPage.toString())
    router.replace(`/tokens?${param}`)
  }, [page, router])

  return {
    page,
    next,
    prev,
  }
}
