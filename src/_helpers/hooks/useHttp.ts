import { IQuery, METHODS, Mutation } from "@/_helpers/types/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { http } from "@/_helpers/lib/api"
import type { AxiosError } from "axios"

const cache: Record<string, any> = {}

export const useHttpQuery = <ReturnType>(url: string, mount: boolean = true): IQuery<ReturnType> => {
  const [data, setData] = useState<ReturnType | null>(cache[url] || null)
  const [loading, setLoading] = useState<boolean>(mount && !cache[url])
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const refetch = () => {
    if (cache[url]) {
      setData(cache[url])
      setLoading(false)
      return
    }

    setLoading(true)

    http
      .get(url)
      .then((res) => {
        cache[url] = res.data
        setData(res.data)
      })
      .catch((err) => {
        if (err.status == 403) {
          return router.push("/sign-in")
        }
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!mount) return
    refetch()
  }, [url])

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

// ------------------------------------------------------------------------------------------------

export const useHttpMutation = <ReturnType, PayloadType = undefined>(
  onSuccess?: (data?: ReturnType) => void,
): Mutation<ReturnType, PayloadType> => {
  const [data, setData] = useState<ReturnType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const make = async (url: string, method: METHODS = METHODS.POST, payload?: PayloadType) => {
    let invocation: Promise<any>
    setLoading(true)

    try {
      switch (method) {
        case METHODS.GET:
          invocation = http.get(url)
          break
        case METHODS.POST:
          invocation = http.post(url, payload)
          break
        case METHODS.PUT:
          invocation = http.put(url, payload)
          break
        case METHODS.PATCH:
          invocation = http.patch(url, payload)
          break
        case METHODS.DELETE:
          invocation = http.delete(url)
          break
        default:
          throw new Error("Unsupported HTTP method")
      }

      const response = await invocation
      setData(response.data)

      if (method !== METHODS.GET) {
        cache[url] = response.data
      }

      onSuccess?.(response.data)
    } catch (err) {
      const errRes = err as AxiosError
      const res = errRes.response?.data as { message: string }

      setError(res?.message)
      setTimeout(() => setError(""), 6000)
    } finally {
      setLoading(false)
    }
  }

  return [make, error, loading, data]
}
