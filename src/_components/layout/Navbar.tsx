"use client"

import { useSearchUser } from "@/_helpers/hooks/useSearchUser"
import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { CircularProgress, Grow } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { IUser } from "@/_helpers/types/types"
import { FaUserCircle } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const roleRoutes: Record<string, string> = {
    admin: "/admin",
    user: "/user",
    guest: "/sign-in",
}

export const Navbar = () => {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)

    const { data } = useHttpQuery<IUser>("/api/auth")
    const { search, handleInputChange, filteredUsers, loading, debouncedSearch } = useSearchUser()

    const open = !!debouncedSearch
    const role = data?.role || "guest"
    const href = roleRoutes[role] || "/sign-in"

    const handleRedirect = (user: IUser) => {
        router.push(`/profile/${user.id}`)
    }

    const handleClickOutside = (evt: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(evt.target as Node) && !inputRef.current?.contains(evt.target as Node)) {
            setIsDropdownVisible(false)
        } else {
            setIsDropdownVisible(true)
        }
    }

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside)
        return () => window.removeEventListener("mousedown", handleClickOutside)
    }, [])
    return (
        <nav className="bg-gray-900 sticky top-0 z-20 bg-opacity-80 backdrop-blur-lg shadow-lg w-full p-2">
            <div className="mx-6 flex justify-between items-center">
                <Link
                    href="/"
                    draggable={false}
                    className="flex items-center gap-3 text-3xl font-bold text-gray-200 transition-all hover:scale-110 duration-400"
                >
                    <Image
                        src="/light-bulb.png"
                        alt="Quiz Icon"
                        width={300}
                        height={200}
                        className="w-12"
                        draggable={false}
                        priority
                    />
                    Quiz
                    <span className="bg-gradient-to-r from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent">
                        App
                    </span>
                </Link>
                <div className="flex justify-center items-center gap-4 w-full max-w-sm max-md:justify-end">
                    <input
                        type="text"
                        ref={inputRef}
                        value={search}
                        onChange={handleInputChange}
                        title="Search users by name, surname or role..."
                        placeholder="Search users by name, surname or role..."
                        className="w-full sm:w-[18rem] md:w-[25rem] px-4 py-2 max-md:hidden rounded-md placeholder:tracking-wide bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 text-sm sm:text-base"
                    />
                    {open && isDropdownVisible && (
                        <Grow in={!!filteredUsers?.length || loading || (!loading && filteredUsers.length === 0)} timeout={500}>
                            <div ref={dropdownRef} className="absolute top-[110%] right-23 w-xs bg-gray-800 text-gray-200 rounded-md border border-gray-700 overflow-hidden shadow-md z-10">
                                {loading ? (
                                    <div className="p-3 text-center italic text-sm text-gray-400">
                                        <svg width={0} height={0}>
                                            <defs>
                                                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#f93b15" />
                                                    <stop offset="50%" stopColor="#f09819" />
                                                    <stop offset="100%" stopColor="#f93b15" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <CircularProgress size={35} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
                                    </div>
                                ) : filteredUsers?.length === 0 ? (
                                    <p className="p-2 text-center italic text-sm tracking-wider text-gray-400">
                                        No users match your current search.
                                    </p>
                                ) : (
                                    <ul className="divide-y divide-gray-700">
                                        {filteredUsers?.map((user) => (
                                            <li
                                                key={user.id}
                                                onClick={() => handleRedirect(user)}
                                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                <p className="text-sm font-medium text-gray-100">
                                                    {user.name} {user.surname}
                                                </p>
                                                <p className="text-xs">
                                                    <span className={`font-semibold ${user.role === "admin" ? "text-red-400" : "text-blue-400"}`}>
                                                        {user.role}
                                                    </span>
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Grow>
                    )}
                    <Link
                        href={href}
                        className="px-2 py-2 my-2 bg-gray-800 rounded-md hover:scale-110 cursor-pointer flex gap-5 items-center transition-all duration-400"
                    >
                        <FaUserCircle size={30} />
                    </Link>
                </div>
            </div>
        </nav>
    )
}


