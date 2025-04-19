"use client"

import { IQuestion, QuizAnswer, IQuizResult, IUser, METHODS } from "@/_helpers/types/types"
import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { Layout } from "@/_components/layout/Layout"
import { useEffect, useRef, useState } from "react"
import { notify } from "@/_helpers/hooks/notify"
import { Loader } from "@/_components/UI/Loader"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"

type AnswerDisabledStatus = Record<number, boolean>
type SelectedAnswers = Record<number, QuizAnswer>

export default function QuizPage() {
    const { quizId } = useParams()
    const contentRef = useRef(null)
    const { handleSubmit } = useForm<IQuestion>()
    const [score, setScore] = useState<number | null>(0)
    const [totalQuestions, setTotalQuestions] = useState<number>(0)
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({})
    const [isAnswerDisabled, setIsAnswerDisabled] = useState<AnswerDisabledStatus>({})
    const [isCheckingAnswer, setIsCheckingAnswer] = useState<boolean>(false)

    const { data: questions = [], loading } = useHttpQuery<IQuestion[]>(`/api/questions/${quizId}`)
    const allAnswered = Object.keys(selectedAnswers).length === questions?.length
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
                        isCorrect: data.isCorrect,
                        correctAnswer: data.correctAnswer,
                    }
                }))

                setIsAnswerDisabled((prev) => ({
                    ...prev, [id]: true,
                }))

                if (data.isCorrect) {
                    setScore((prevScore) => (prevScore ?? 0) + 1)
                }
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
        if (!allAnswered) {
            notify("error", "Please answer all the questions before submitting.")
            return
        }

        const answers = Object.keys(selectedAnswers).map((id) => {
            const answer = selectedAnswers[+id]
            return {
                id: +id,
                selectedAnswer: answer.selectedAnswer,
                isCorrect: answer.isCorrect,
            }
        })

        const now = new Date()
        const completedAt = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString()

        const result: IQuizResult = {
            userId: id,
            quizId: String(quizId),
            answers,
            completedAt
        }

        await submitQuizResult(`/api/quizzes/${quizId}`, METHODS.POST, result)
    }

    useEffect(() => {
        if (questions) {
            setTotalQuestions(questions.length)
        }
    }, [questions])

    return (
        <Layout>
            {loading && <Loader isLoading={loading || isCheckingAnswer} />}
            <section ref={contentRef} className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 flex justify-center items-center">
                <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h1 className="text-4xl font-bold text-center mb-6 tracking-wide bg-gradient-to-bl from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent">Quiz Time!</h1>
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
                                            {answers.map((answer, idx) => {
                                                const selected = selectedAnswers[id!]
                                                const isSelected = selected?.selectedAnswer === answer
                                                const isCorrectAnswer = selected?.correctAnswer === answer

                                                return (
                                                    <li
                                                        key={idx}
                                                        onClick={() => handleAnswerClick(id!, answer)}
                                                        style={{ pointerEvents: isAnswerDisabled[id!] ? "none" : "auto" }}
                                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-[18px] transition-all ease-linear text-gray-200
                                                             ${isSelected
                                                                ? (selected.isCorrect ? "bg-green-600" : "bg-red-400")
                                                                : isCorrectAnswer ? "bg-green-600" : "bg-gray-600 hover:bg-gray-500"
                                                            }`}
                                                    >
                                                        {answer}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="submit"
                                disabled={!allAnswered}
                                className={`w-full mt-4 px-5 py-3 rounded-lg shadow-lg text-lg font-semibold tracking-wide transition-all duration-200
                                    ${!allAnswered ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"}`}>
                                Submit Answers
                            </button>
                        </form>
                    )}
                    {score !== null && totalQuestions > 0 && (
                        <div className={`fixed top-1/4 right-6 transform -translate-y-1/2 p-5 rounded-xl shadow-xs w-max tracking-wide ${score === totalQuestions ? "bg-green-700 animate-bounce" : "bg-gray-800 text-gray-300"}`}>
                            <h2 className="text-xl font-bold text-center text-shadow"> {score === totalQuestions ? "Perfect Score" : "Your Performance"}: {score} / {totalQuestions}</h2>
                        </div>
                    )}
                </div>
            </section>
            <ScrollButton targetRef={contentRef} />
        </Layout>
    )
}
