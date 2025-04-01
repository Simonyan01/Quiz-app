"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { getMenuItems } from "@/_helpers/router/routes"
import { IUser, METHODS } from "@/_helpers/types/types"
import { MdMenuOpen } from "react-icons/md"
import { useRouter } from "next/navigation"
import { useState } from 'react'
import Link from "next/link"

export const Sidebar = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const [logout] = useHttpMutation(() => router.push("/sign-in"))
    const { data } = useHttpQuery<IUser>("/api/auth")
    const { role } = data ?? {}

    const handleSwitch = () => {
        setOpen(prev => !prev)
    }

    const handleLogOut = () => {
        try {
            logout("/api/logout", METHODS.POST)
        } catch (err) {
            console.error(`Logout failed:${err}`)
        }
    }

    const menuItems = getMenuItems(role, handleLogOut)

    return (
        <nav className={`shadow-md min-h-screen p-2 flex flex-col transition-all duration-300 bg-gray-800 text-white ${open ? 'w-50' : 'w-16'}`}>
            <div className='px-1 mt-2 h-22 flex items-center'>
                <MdMenuOpen
                    size={40}
                    onClick={handleSwitch}
                    className={`duration-300 cursor-pointer ${!open && 'rotate-180'}`}
                />
            </div>
            <ul className='flex-1'>
                {menuItems.map(({ icons, label, path, action }) => (
                    <Link key={label} href={path}>
                        <li onClick={action} className="px-2 py-2 my-3 bg-gray-800 transition-all duration-400 rounded-md cursor-pointer flex gap-5 items-center hover:bg-gradient-to-r from-[#f09819] via-[#ff5330] to-[#f09819]">
                            <div>{icons}</div>
                            <p className={`duration-400 overflow-hidden transition-all ${!open ? "opacity-0 translate-x-[-10px]" : "opacity-100 translate-x-0 tracking-widest"}`}>
                                {label}
                            </p>
                        </li>
                    </Link>
                ))}
            </ul>
        </nav>
    )
}