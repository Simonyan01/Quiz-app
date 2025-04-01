import { IQuery, METHODS, Mutation } from "@/_helpers/types/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { http } from "@/_helpers/lib/api"
import type { AxiosError } from "axios"

export const useHttpQuery = <ReturnType>(url: string, mount: boolean = true): IQuery<ReturnType> => {
  const [data, setData] = useState<ReturnType | null>(null)
  const [loading, setLoading] = useState<boolean>(mount)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const refetch = () => {
    setLoading(true)

    http
      .get(url)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        if (err.status == 403) {
          return router.push("/sign-in")
        }
        setError(err.message || "An error occurred")
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
    loading,
    error,
    data: data as ReturnType,
    refetch,
    setError,
    setLoading,
    setData,
  }
}

// ------------------------------------------------------------------------------------------------

export const useHttpMutation = <ReturnType, PayloadType = undefined>(
  onSuccess?: (data?: ReturnType) => void,
): Mutation<ReturnType, PayloadType> => {
  const [data, setData] = useState<ReturnType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
      setError("")
      onSuccess?.(response.data)
    } catch (err) {
      const errRes = err as AxiosError
      const res = errRes.response?.data as { message: string }

      setError(res?.message)
      setTimeout(() => setError(""), 5000)
    } finally {
      setLoading(false)
    }
  }

  return [make, error, loading, data]
}
