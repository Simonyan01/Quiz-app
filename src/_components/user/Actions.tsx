"use client"

import { useRouter } from "next/navigation"

export const Actions = () => {
    const router = useRouter()

    const buttonOfSettings = { label: "Settings", href: "/user/settings", color: "indigo" }
    const { label, href, color } = buttonOfSettings

    const buttons = [
        { label: "Quizzes", href: "/user/quizzes", color: "green" },
        { label: "Users", href: "/profile", color: "green" },
        { label: "Statistics", href: "/user/quiz-results", color: "green" },
    ]
    return (
        <div className="mt-6 tracking-wider space-y-4">
            <div className="grid grid-cols-1">
                <button
                    key={label}
                    type="button"
                    onClick={() => router.push(href)}
                    className={`bg-${color}-600 p-2 rounded-lg hover:bg-${color}-700 transition-all duration-300 cursor-pointer text-xl hover:scale-105`}>
                    {label}
                </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
        </div>
    )
}
