"use client"

import { useRouter } from "next/navigation"

export const Actions = () => {
    const router = useRouter()
    const buttons = [
        { label: "Settings", href: "/user/settings", color: "indigo" },
        { label: "Quizzes", href: "/user/quizzes", color: "green" },
        { label: "Statistics", href: "/user/quiz-results", color: "green" },
    ]

    return (
        <div className="grid grid-cols-3 gap-4 mt-6 tracking-wider">
            {buttons.map(({ label, href, color }) => (
                <button
                    key={label}
                    type="button"
                    onClick={() => router.push(href)}
                    className={`bg-${color}-600 p-2 rounded-lg hover:bg-${color}-700 transition-all duration-300 cursor-pointer hover:scale-105`}>
                    {label}
                </button>
            ))}
        </div>
    )
}
