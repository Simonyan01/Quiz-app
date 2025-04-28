"use client"

import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { IQuiz, IQuizResult } from "@/_helpers/types/types"
import { QuizResultItem } from "./QuizResultItem"

interface IResultListProps {
    quizzes: IQuiz[],
    results: IQuizResult[],
}

export const QuizResultList = ({ quizzes, results }: IResultListProps) => {
    const getQuizById = (quizzes: IQuiz[], id: number) => {
        return (quizzes ?? []).find(q => q.id === id)
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
                return (
                    <QuizResultItem
                        key={result.id}
                        result={result}
                        quiz={quiz}
                    />
                )
            })}
        </ul>
    )
}
