"use client"

import { adminRoutes } from "@/_helpers/config/adminRoutes"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { IUser, METHODS } from "@/_helpers/lib/types"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import Loader from "./Loader"

export default function Navbar() {
    const router = useRouter()
    const { data, loading, refetch } = useHttpQuery<IUser>("/api/auth")
    const [logout] = useHttpMutation(() => router.push("/login"))

    const handleLogout = () => {
        try {
            logout("/api/logout", METHODS.POST)
            refetch()
        } catch (err) {
            console.error(`Error logging out: ${err}`)
        }
    }

    return (
        <>
            <Loader isLoading={loading} />
            <nav className="bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-lg relative  top-0 w-full p-4">
                <div className="mx-4 flex justify-between items-center">
                    <Link
                        href="/"
                        draggable={false}
                        className="flex items-center gap-3 text-3xl font-bold text-gray-200 transition-transform hover:scale-105"
                    >
                        <img src="/light-bulb.png" alt="Quiz Icon" className="w-10" draggable={false} />
                        Quiz <span className="bg-gradient-to-r from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent">App</span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        {data ? (
                            <>
                                {data.role === "user" && (
                                    <Link href="/user" className="text-lg text-gray-300 hover:text-indigo-400 transition-all">
                                        Profile
                                    </Link>
                                )}
                                {data.role === "admin" && (
                                    <>
                                        {adminRoutes.map(({ path, label }) => (
                                            <Link
                                                key={path}
                                                href={path}
                                                className="text-lg text-gray-300 hover:text-indigo-400 transition-all"
                                            >
                                                {label}
                                            </Link>
                                        ))}
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-pink-500 text-gray-200 rounded-lg shadow-md transition-all hover:bg-pink-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-[6px] border border-green-400 text-green-400 rounded-lg tracking-wide transition-all duration-300 hover:bg-green-600 text-xl font-bold hover:text-gray-200"
                            >
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}
