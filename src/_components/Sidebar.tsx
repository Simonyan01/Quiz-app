"use client"

import { MdOutlineDashboard, MdOutlineVerifiedUser } from "react-icons/md"
import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { IoHomeOutline } from "react-icons/io5"
import { FaUserCircle } from "react-icons/fa"
import { IUser } from "@/_helpers/lib/types"
import { CiSettings } from "react-icons/ci"
import { MdMenuOpen } from "react-icons/md"
import { useState } from 'react'
import Link from "next/link"

export const Sidebar = () => {
    const [open, setOpen] = useState(false)
    const { data } = useHttpQuery<IUser>("/api/auth")
    const { role } = data ?? {}

    const menuItems = role === "admin" ? [
        {
            path: "/admin",
            label: 'Main page',
            icons: <IoHomeOutline size={30} />
        },
        {

            path: "/admin/dashboard",
            label: 'Dashboard',
            icons: <MdOutlineDashboard size={30} />
        },
        {

            path: "/admin/users",
            label: 'Users',
            icons: <MdOutlineVerifiedUser size={30} />
        },
        {

            path: "/admin/quizzes",
            label: 'Quizzes',
            icons: <MdOutlineVerifiedUser size={30} />
        },
        {

            path: "/admin/settings",
            label: 'Settings',
            icons: <CiSettings size={30} />
        }
    ] : [
        {

            path: "/user",
            label: 'Home',
            icons: <IoHomeOutline size={30} />
        },
        {

            path: "/user/quizzes",
            label: 'Quizzes',
            icons: <FaUserCircle size={30} />
        }
    ]

    return (
        <nav className={`shadow-md h-screen bg p-2 flex flex-col duration-300 bg-gray-800 text-white ${open ? 'w-48' : 'w-16'}`}>
            <div className='px-1 h-22 flex items-center'>
                <div>
                    <MdMenuOpen
                        size={40}
                        className={`duration-400 cursor-pointer ${!open && 'rotate-180'}`}
                        onClick={() => setOpen(prev => !prev)}
                    />
                </div>
            </div>
            <ul className='flex-1'>
                {menuItems.map(({ icons, label, path }) => (
                    <Link key={label} href={path}>
                        <li className="px-2 py-2 my-2 bg-gray-800 transition-all duration-400 rounded-md cursor-pointer flex gap-5 items-center hover:bg-gradient-to-r from-[#f09819] via-[#ff5330] to-[#f09819]">
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