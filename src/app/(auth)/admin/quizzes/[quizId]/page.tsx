"use client"

import { IQuestion, QuizAnswer, IQuizResult, IUser, METHODS } from "@/_helpers/types/types"
import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"

type AnswerDisabledStatus = Record<number, boolean>
type SelectedAnswers = Record<number, QuizAnswer>

export default function QuizPage() {
    const params = useParams()
    const { quizId } = params
    const contentRef = useRef(null)
    const { handleSubmit } = useForm<IQuestion>()
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({})
    const [isAnswerDisabled, setIsAnswerDisabled] = useState<AnswerDisabledStatus>({})
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false)

    const { data: questions, loading } = useHttpQuery<IQuestion[]>(`/api/questions/${quizId}`)
    const [submitQuizResult] = useHttpMutation<IQuizResult, IQuizResult>()
    const { data } = useHttpQuery<IUser>("/api/auth")
    const { id } = data ?? {}

    const handleAnswerClick = async (id: number, answer: string) => {
        setIsCheckingAnswer(true)

        try {
            const response = await fetch(`/api/questions/${id}/check`, {
                method: 'POST',
                body: JSON.stringify({
                    id,
                    selectedAnswer: answer,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSelectedAnswers((prev) => ({
                    ...prev,
                    [id]: {
                        id,
                        selectedAnswer: answer,
                        isCorrect: data.isCorrect
                    }
                }))

                setIsAnswerDisabled((prev) => ({
                    ...prev, [id]: true,
                }))
            } else {
                console.error(`Error checking answer:${data.message}`)
            }

        } catch (err) {
            console.error(`Error checking answer:${err}`)
        } finally {
            setIsCheckingAnswer(false)
        }
    }

    const handleSubmitResult = async () => {
        const answers = Object.keys(selectedAnswers).map((id) => {
            const answer = selectedAnswers[+id]
            return {
                id: +id,
                selectedAnswer: answer.selectedAnswer,
                isCorrect: answer.isCorrect,
            }
        })

        const result: IQuizResult = {
            userId: id,
            quizId: String(quizId),
            answers,
            completedAt: new Date()
        }

        await submitQuizResult(`/api/quizzes/${quizId}`, METHODS.POST, result)
    }

    return (
        <Layout>
            <Loader isLoading={loading || isCheckingAnswer} />
            <section ref={contentRef} className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 flex justify-center items-center">
                <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h1 className="text-4xl font-bold text-center mb-6 tracking-wide text-indigo-400">Quiz Time!</h1>
                    {!questions || questions.length === 0 ? (
                        <UnavailableMessage message="No questions available for this quiz" />
                    ) : (
                        <form onSubmit={handleSubmit(handleSubmitResult)} className="space-y-4">
                            <ul className="space-y-4">
                                {questions.map(({ id, answers, question }) => (
                                    <li key={id} className="bg-gray-700 p-5 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
                                            {question}
                                        </h3>
                                        <ul className="space-y-2">
                                            {answers.map((answer, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => handleAnswerClick(id, answer)}
                                                    style={{ pointerEvents: isAnswerDisabled[id] ? "none" : "auto" }}
                                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-[18px] transition-all ease-linear text-gray-200 
                                                    ${selectedAnswers[id]?.selectedAnswer === answer ? (selectedAnswers[id].isCorrect ? "bg-green-600" : "bg-red-400") : "bg-gray-600 hover:bg-gray-500"}`}
                                                >
                                                    {answer}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="submit"
                                className="w-full mt-4 px-5 py-3 bg-blue-500 cursor-pointer hover:bg-blue-600 rounded-lg shadow-lg text-lg font-semibold tracking-wide transition-all duration-200">
                                Submit Answers
                            </button>
                            {/* {score !== null && (
                                <div className="text-center mt-4 p-4 bg-gray-900 text-white rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-bold">Your Score: {score}</h2>
                                </div>
                            )} */}
                        </form>
                    )}
                </div>
            </section>
            <ScrollButton targetRef={contentRef} />
        </Layout>
    )
}
