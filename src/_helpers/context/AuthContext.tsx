// "use client"

// import { createContext, ReactNode, useState } from "react"
// import { IUser } from "../lib/types"
// import axios from "axios"

// interface IProps {
//     children: ReactNode
// }

// interface AuthContextType {
//     user: IUser | null
//     setUser: (user: IUser | null) => void
//     fetchUser: () => Promise<void>
// }

// export const AuthContext = createContext<AuthContextType | null>(null)

// export const AuthProvider = ({ children }: IProps) => {
//     const [user, setUser] = useState<IUser | null>(null)

//     const fetchUser = async () => {
//         try {
//             const res = await axios.get("/api/auth")
//             setUser(res.data)
//         } catch {
//             setUser(null)
//         }
//     }

//     return (
//         <AuthContext.Provider value={{ user, setUser, fetchUser }}>
//             {children}
//         </AuthContext.Provider>
//     )

// }