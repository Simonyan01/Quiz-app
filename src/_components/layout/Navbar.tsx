"use client"

import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { IUser } from "@/_helpers/types/types"
import { FaUserCircle } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Link from "next/link"

export const Navbar = () => {
    const router = useRouter()
    const { data } = useHttpQuery<IUser>("/api/auth")
    const { role } = data ?? {}

    const handleHomeClick = () => {
        const routes = {
            admin: "/admin",
            user: "/user",
            undefined: "/sign-in",
        }

        router.push(routes[role] || "/sign-in")
    }

    return (
        <nav className="bg-gray-900 sticky top-0 z-20 bg-opacity-80 backdrop-blur-lg shadow-lg w-full p-2">
            <div className="mx-6 flex justify-between items-center">
                <Link
                    href="/"
                    draggable={false}
                    className="flex items-center gap-3 text-3xl font-bold text-gray-200 transition-all hover:scale-115 duration-400"
                >
                    <img
                        src="/light-bulb.png"
                        alt="Quiz Icon"
                        className="w-10"
                        draggable={false}
                    />
                    Quiz <span className="bg-gradient-to-r from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent">App</span>
                </Link>
                <ul className="flex items-center gap-6">
                    <li
                        onClick={handleHomeClick}
                        className="px-2 py-2 my-2 bg-gray-800 rounded-md hover:scale-110 cursor-pointer flex gap-5 items-center transition-all duration-500"
                    >
                        <FaUserCircle size={30} />
                    </li>
                </ul>
            </div>
        </nav>
    )
}
