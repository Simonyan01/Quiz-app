"use client"

import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { IQuiz, IQuizResult, IUser } from "@/_helpers/types/types"
import { QuizResultItem } from "./QuizResultItem"

interface IProps {
    users: IUser[]
    quizzes: IQuiz[],
    results: IQuizResult[],
}

export const QuizResultList = ({ results, quizzes, users }: IProps) => {
    const getQuizById = (quizzes: IQuiz[], id: number) => {
        return (quizzes ?? []).find(q => q.id === id)
    }

    const getUserById = (users: IUser[], id: number) => {
        return (users ?? []).find(u => u.id === id)
    }

    if (!Array.isArray(results) || results.length === 0) {
        return (
            <UnavailableMessage
                message="No results available"
                additionalMessage="after you take the quizzes and you'll see the results here."
            />
        )
    }
    return (
        <ul className="space-y-6">
            {results.map(result => {
                const quiz = getQuizById(quizzes, Number(result.quizId))
                const user = getUserById(users, result.userId)
                return (
                    <QuizResultItem
                        key={result.id}
                        result={result}
                        quiz={quiz}
                        user={user}
                    />
                )
            })}
        </ul>
    )
}
