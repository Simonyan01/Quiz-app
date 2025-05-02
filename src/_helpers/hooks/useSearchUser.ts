"use client"

import { useDebounce } from "@/_helpers/hooks/useDebounce"
import { useState, useEffect, ChangeEvent } from "react"
import { IUser } from "@/_helpers/types/types"

export const useSearchUser = () => {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [_, setErrorMessage] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 600)

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredUsers([])
      return
    }

    const fetchUsers = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const response = await fetch(`/api/users?search=${debouncedSearch}`)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Error ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        setFilteredUsers(data)
      } catch (err) {
        setFilteredUsers([])

        if (err instanceof Error) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage("Something went wrong")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [debouncedSearch])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return {
    search,
    handleInputChange,
    filteredUsers,
    loading,
    debouncedSearch,
  }
}
