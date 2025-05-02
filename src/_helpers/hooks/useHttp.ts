import { IQuery, METHODS, Mutation } from "@/_helpers/types/types"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { http } from "@/_helpers/lib/api"
import type { AxiosError } from "axios"

export const useHttpQuery = <ReturnType>(url: string, mount: boolean = true): IQuery<ReturnType> => {
  const [data, setData] = useState<ReturnType | null>(null)
  const [loading, setLoading] = useState<boolean>(mount)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const refetch = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const res = await http.get(url)
      setData(res.data)
    } catch (err) {
      const errRes = err as AxiosError<{ message?: string }>

      if (errRes.response?.status === 401) {
        try {
          await http.post("/api/auth/refresh")

          const retryRes = await http.get(url)
          setData(retryRes.data)

          if (retryRes.data.role === "admin") {
            router.push("/admin")
          } else if (retryRes.data.role === "user") {
            router.push("/user")
          }
        } catch (retryErr) {
          const error = retryErr as AxiosError<{ message?: string }>
          setError(error.response?.data.message || error.message)
        }
      } else {
        setError(errRes.response?.data.message || errRes.message)
      }
    } finally {
      setLoading(false)
    }
  }, [url, router])

  useEffect(() => {
    if (!mount) return

    let isActive = true

    const fetch = async () => {
      if (isActive) {
        await refetch()
      }
    }
    fetch()

    return () => {
      isActive = false
    }
  }, [mount, url])

  return {
    data: data as ReturnType,
    loading,
    error,
    refetch,
    setData,
    setLoading,
    setError,
  }
}

// ----------------------------------------------------------------------------------------------------

export const useHttpMutation = <ReturnType, PayloadType = undefined>(
  onSuccess?: (data?: ReturnType) => void,
): Mutation<ReturnType, PayloadType> => {
  const [data, setData] = useState<ReturnType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const make = async (url: string, method: METHODS = METHODS.POST, payload?: PayloadType) => {
    setLoading(true)

    try {
      const res = await (() => {
        switch (method) {
          case METHODS.GET:
            return http.get(url)
          case METHODS.POST:
            return http.post(url, payload)
          case METHODS.PUT:
            return http.put(url, payload)
          case METHODS.PATCH:
            return http.patch(url, payload)
          case METHODS.DELETE:
            return http.delete(url)
          default:
            throw new Error("Unsupported HTTP method")
        }
      })()

      const result = res.data as ReturnType
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const errRes = err as AxiosError<{ message?: string }>
      setError(errRes.response?.data.message || errRes.message)
      setTimeout(() => setError(""), 6000)
    } finally {
      setLoading(false)
    }
  }

  return [make, error, loading, data]
}
