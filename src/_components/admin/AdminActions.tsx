"use client"

import { useRouter } from "next/navigation"

interface IButtonProps {
    onAddUser: () => void
}

export const AdminActions = ({ onAddUser }: IButtonProps) => {
    const router = useRouter()

    return (
        <div className="grid grid-cols-3 gap-4 mt-6 tracking-wide">
            <button
                type="button"
                onClick={() => router.push("/admin/manage-users")}
                className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 cursor-pointer hover:scale-105">
                Manage users
            </button>
            <button
                type="button"
                onClick={onAddUser}
                className="bg-green-600 p-2 rounded-lg hover:bg-green-700 transition-all duration-300 cursor-pointer hover:scale-105">
                Add user
            </button>
            <button
                type="button"
                onClick={() => router.push("/admin/quizzes/add")}
                className="bg-green-600 p-2 rounded-lg hover:bg-green-700 transition-all duration-300 cursor-pointer hover:scale-105">
                Add quiz
            </button>
        </div>
    )
}
