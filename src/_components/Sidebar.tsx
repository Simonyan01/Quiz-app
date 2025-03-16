"use client"

import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { MdOutlineDashboard } from "react-icons/md"
import { IoHomeOutline } from "react-icons/io5"
import { FaUserCircle } from "react-icons/fa"
import { IUser } from "@/_helpers/lib/types"
import { CiSettings } from "react-icons/ci"
import { MdMenuOpen } from "react-icons/md"
import { JSX, useState } from 'react'

interface MenuItem {
    label: string
    icons: JSX.Element
}

export default function Sidebar() {
    const { data } = useHttpQuery<IUser>("/api/auth")
    const [open, setOpen] = useState(false)

    const menuItems = data?.role === "admin" ? [
        {
            label: 'Home',
            icons: <IoHomeOutline size={30} />
        },
        {
            label: 'Profile',
            icons: <FaUserCircle size={30} />
        },
        {
            label: 'Dashboard',
            icons: <MdOutlineDashboard size={30} />
        },
        {
            label: 'Settings',
            icons: <CiSettings size={30} />
        }
    ] : [
        {
            label: 'Home',
            icons: <IoHomeOutline size={30} />
        },
        {
            label: 'Profile',
            icons: <FaUserCircle size={30} />
        }
    ]

    return (
        <nav className={`shadow-md h-screen bg p-2 flex flex-col duration-500 bg-gray-800 text-white ${open ? 'w-48' : 'w-16'}`}>
            <div className='px-1 h-22 flex items-center'>
                <div>
                    <MdMenuOpen
                        size={40}
                        className={`duration-500 cursor-pointer ${!open && 'rotate-180'}`}
                        onClick={() => setOpen(prev => !prev)}
                    />
                </div>
            </div>
            <ul className='flex-1'>
                {menuItems.map(({ icons, label }) => (
                    <li key={label} className='px-2 py-2 my-2 bg-gradient-to-r hover:transition-all hover:from-[#f09819] hover:via-[#ff5330] hover:to-[#ff5330] rounded-md duration-300 cursor-pointer flex gap-5 items-center'>
                        <div>{icons}</div>
                        <p className={`duration-500 overflow-hidden ${!open ? "translate-z-24 opacity-0" : "translate-z-0 opacity-100 tracking-widest"}`}>
                            {label}
                        </p>
                    </li>
                ))}
            </ul>
        </nav>
    )
}