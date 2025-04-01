"use client"

import { useRouter } from "next/navigation"

export const Actions = () => {
    const router = useRouter()

    return (
        <div className="grid grid-cols-2 gap-4 mt-6 tracking-wider">
            <button
                type="button"
                onClick={() => router.push("/user/quizzes")}
                className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500 transition-all cursor-pointer">
                Quizzes
            </button>
            <button
                type="button"
                onClick={() => router.push("/user/settings")}
                className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500 transition-all cursor-pointer">
                Settings
            </button>
        </div>
    )
}
