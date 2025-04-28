"use client"

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { IQuiz, IQuizResult } from "@/_helpers/types/types"

interface IResultItemProps {
    quiz?: IQuiz,
    result: IQuizResult
}

export const QuizResultItem = ({ result, quiz }: IResultItemProps) => {
    const safeScore = result?.score ?? 0
    const getStatusIcon = (score: number) => {
        const iconProps = "text-50 hover:scale-110 duration-200 transition-all cursor-pointer"

        if (score < 500) return <FaTimesCircle size={45} className={`text-red-500 ${iconProps}`} title="Failed" />
        if (score <= 1100) return <FaCheckCircle size={45} className={`text-orange-400 ${iconProps}`} title="Average" />
        return <FaCheckCircle size={45} className={`text-green-400 ${iconProps}`} title="Passed" />
    }

    return (
        <li
            key={result.id}
            className="flex items-center justify-between w-full p-4 bg-gray-700 rounded-2xl shadow-md hover:scale-[103%] tracking-wider transition-all"
        >
            <div>
                <h3 className="text-xl font-semibold text-white mb-1"> {quiz ? `Quiz #${quiz.id}: ${quiz.title}` : "Untitled Quiz"}</h3>
                <p className="text-gray-300 italic mb-[2px]">{quiz?.description}</p>
                <p className="text-gray-300 text-xl">
                    Score: <span className={`${safeScore > 1100 ? "text-green-400 font-semibold" : "font-semibold"}`}>{safeScore}</span>
                </p>
            </div>
            <div className="text-2xl">
                {getStatusIcon(safeScore)}
            </div>
        </li>
    )
}
