"use client"

import { useRouter } from "next/navigation"

interface IButtonProps {
    onAddUser: () => void
}

export const Actions = ({ onAddUser }: IButtonProps) => {
    const router = useRouter()
    const buttons = [
        { label: "Manage users", href: "/admin/manage-users", color: "indigo" },
        { label: "Statistics", href: "/admin/quiz-results", color: "indigo" },
        { label: "Add user", onClick: onAddUser, color: "green" },
        { label: "Add quiz", href: "/admin/quizzes/add", color: "green" },
        { label: "Users", href: "/profile", color: "green" },
        { label: "Quizzes", href: "/admin/quizzes", color: "green" },
    ]

    return (
        <div className="grid grid-cols-2 gap-4 mt-6 tracking-wide">
            {buttons.map(({ label, href, onClick, color }) => (
                <button
                    key={label}
                    type="button"
                    onClick={onClick ?? (() => router.push(href))}
                    className={`bg-${color}-600 p-2 rounded-lg hover:bg-${color}-700 transition-all duration-300 cursor-pointer hover:scale-105`}>
                    {label}
                </button>
            ))}
        </div>
    )
}
