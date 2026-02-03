import { useState, useCallback, useRef, useEffect } from 'react'
import { PAGINATION } from '@/features/home/constants'

// ========== Offset-based Pagination (Legacy) ==========

interface PaginationState<T> {
  data: T[]
  total: number | null
  offset: number
  loading: boolean
  error: string | null
  retryCount: number
}

interface UsePaginationOptions<T> {
  limit?: number
  fetchFn: (limit: number, offset: number) => Promise<{ data: T[]; total: number }>
  errorMessage?: string
}

export function usePagination<T>({
  limit = PAGINATION.defaultLimit,
  fetchFn,
  errorMessage = 'โหลดข้อมูลไม่สำเร็จ',
}: UsePaginationOptions<T>) {
  const [state, setState] = useState<PaginationState<T>>({
    data: [],
    total: null,
    offset: 0,
    loading: false,
    error: null,
    retryCount: 0,
  })

  const hasMore = state.total !== null && state.offset + state.data.length < state.total

  const reset = useCallback(() => {
    setState({
      data: [],
      total: null,
      offset: 0,
      loading: false,
      error: null,
      retryCount: 0,
    })
  }, [])

  const loadInitial = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null, offset: 0 }))
    try {
      const response = await fetchFn(limit, 0)
      setState({
        data: response.data || [],
        total: response.total ?? null,
        offset: 0,
        loading: false,
        error: null,
        retryCount: 0,
      })
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
    }
  }, [fetchFn, limit, errorMessage])

  const loadMore = useCallback(async () => {
    if (state.loading || !hasMore) return
    
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const nextOffset = state.offset + limit
      const response = await fetchFn(limit, nextOffset)
      setState((prev) => ({
        ...prev,
        data: [...prev.data, ...(response.data || [])],
        total: response.total ?? null,
        offset: nextOffset,
        loading: false,
        error: null,
        retryCount: 0,
      }))
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
    }
  }, [state.loading, state.offset, hasMore, fetchFn, limit, errorMessage])

  const retry = useCallback(() => {
    setState((prev) => {
      const nextCount = prev.retryCount + 1
      const delay = Math.min(
        PAGINATION.baseRetryDelay * Math.pow(2, nextCount),
        PAGINATION.maxRetryDelay
      )
      setTimeout(() => loadMore(), delay)
      return { ...prev, retryCount: nextCount }
    })
  }, [loadMore])

  return {
    data: state.data,
    total: state.total,
    loading: state.loading,
    error: state.error,
    hasMore,
    loadInitial,
    loadMore,
    retry,
    reset,
  }
}

// ========== Cursor-based Pagination (Recommended for large datasets) ==========

interface CursorPaginationState<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
  loading: boolean
  error: string | null
  retryCount: number
}

interface UseCursorPaginationOptions<T> {
  limit?: number
  fetchFn: (limit: number, cursor?: string) => Promise<{ data: T[]; next_cursor?: string; has_more: boolean }>
  errorMessage?: string
}

export function useCursorPagination<T>({
  limit = PAGINATION.defaultLimit,
  fetchFn,
  errorMessage = 'โหลดข้อมูลไม่สำเร็จ',
}: UseCursorPaginationOptions<T>) {
  const [state, setState] = useState<CursorPaginationState<T>>({
    data: [],
    nextCursor: null,
    hasMore: true,
    loading: false,
    error: null,
    retryCount: 0,
  })

  const reset = useCallback(() => {
    setState({
      data: [],
      nextCursor: null,
      hasMore: true,
      loading: false,
      error: null,
      retryCount: 0,
    })
  }, [])

  const loadInitial = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null, data: [], nextCursor: null }))
    try {
      const response = await fetchFn(limit)
      setState({
        data: response.data || [],
        nextCursor: response.next_cursor || null,
        hasMore: response.has_more,
        loading: false,
        error: null,
        retryCount: 0,
      })
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false, error: errorMessage, hasMore: false }))
    }
  }, [fetchFn, limit, errorMessage])

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return
    
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await fetchFn(limit, state.nextCursor || undefined)
      setState((prev) => ({
        ...prev,
        data: [...prev.data, ...(response.data || [])],
        nextCursor: response.next_cursor || null,
        hasMore: response.has_more,
        loading: false,
        error: null,
        retryCount: 0,
      }))
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
    }
  }, [state.loading, state.hasMore, state.nextCursor, fetchFn, limit, errorMessage])

  const retry = useCallback(() => {
    setState((prev) => {
      const nextCount = prev.retryCount + 1
      const delay = Math.min(
        PAGINATION.baseRetryDelay * Math.pow(2, nextCount),
        PAGINATION.maxRetryDelay
      )
      setTimeout(() => loadMore(), delay)
      return { ...prev, retryCount: nextCount }
    })
  }, [loadMore])

  return {
    data: state.data,
    nextCursor: state.nextCursor,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    loadInitial,
    loadMore,
    retry,
    reset,
  }
}

// Infinite scroll sentinel hook
export function useInfiniteScroll(
  onIntersect: () => void,
  enabled: boolean = true
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          onIntersect()
        }
      },
      {
        root: null,
        rootMargin: PAGINATION.rootMargin,
        threshold: PAGINATION.threshold,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [onIntersect, enabled])

  return sentinelRef
}
