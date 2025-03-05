"use client"

import { useAuth } from "@/_helpers/hooks/useAuth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

export default function Navbar() {
    const { user, setUser } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await axios.get('/api/logout')
            setUser(null)
            router.push("/login")
        } catch (err) {
            console.error(`Error logging out: ${err}`)
        }
    }

    return (
        <nav className="bg-gray-900 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-400 hover:text-pink-400 transition">
                    Quiz App
                </Link>
                <div className="space-x-6">
                    <Link href="/" className="text-lg hover:text-indigo-300 transition">
                        Home
                    </Link>
                    {user && user.role === "user" && (
                        <>
                            <Link href="/profile" className="text-lg hover:text-indigo-300 transition">
                                Profile
                            </Link>
                            <Link href="/logout" className="text-lg hover:text-pink-300 transition">
                                Logout
                            </Link>
                        </>
                    )}
                    {user && user.role === "admin" && (
                        <>
                            <Link href="/admin/dashboard" className="text-lg hover:text-indigo-300 transition">
                                Dashboard
                            </Link>
                            <Link href="/admin/users" className="text-lg hover:text-indigo-300 transition">
                                Users
                            </Link>
                            <button type="button" onClick={handleLogout} className="text-lg hover:text-pink-300 transition">
                                Logout
                            </button>
                        </>
                    )}
                    {!user && (
                        <Link href="/login" className="text-lg hover:text-pink-300 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
