import { IQuery, METHODS, Mutation } from "../lib/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { Http } from "../lib/api"

export const useHttpQuery = <ReturnType>(url: string, mount: boolean = true): IQuery<ReturnType> => {
  const [data, setData] = useState<ReturnType | null>(null)
  const [loading, setLoading] = useState<boolean>(mount)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const refetch = () => {
    setLoading(true)

    Http.get(url)
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

// ----------------------------------------------------------------------------

export const useHttpMutation = <ReturnType, PayloadType = null>(
  onSuccess: ((data?: any) => void) | undefined,
): Mutation<ReturnType, PayloadType> => {
  const [data, setData] = useState<ReturnType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const make = async (url: string, method: METHODS = METHODS.POST, payload?: PayloadType | undefined) => {
    let invocation = null
    setLoading(true)

    try {
      switch (method) {
        case METHODS.GET:
          invocation = Http.get(url)
          break
        case METHODS.POST:
          invocation = Http.post(url, payload)
          break
        case METHODS.PUT:
          invocation = Http.put(url, payload)
          break
        case METHODS.PATCH:
          invocation = Http.patch(url, payload)
          break
        case METHODS.DELETE:
          invocation = Http.delete(url)
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

  return [make, error, loading, data as ReturnType]
}
