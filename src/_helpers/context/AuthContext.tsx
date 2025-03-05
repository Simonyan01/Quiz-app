"use client"

import { createContext, FC, ReactNode, useEffect, useState } from "react"
import { IUser } from "../lib/types"
import axios from "axios"

interface AuthContextType {
    user: IUser | null
    setUser: (user: IUser | null) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        axios.get("/api/auth")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )

}