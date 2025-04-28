"use client"

import { IQuestion, QuizAnswer, IQuizResult, IUser, METHODS } from "@/_helpers/types/types"
import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { useCallback, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Layout } from "@/_components/layout/Layout"
import { notify } from "@/_helpers/hooks/notify"
import { Loader } from "@/_components/UI/Loader"
import { ToastContainer } from "react-toastify"
import { useForm } from "react-hook-form"

type SelectedAnswers = Record<number, QuizAnswer>
type AnswerDisabledStatus = Record<number, boolean>

export default function QuizPage() {
    const router = useRouter()
    const { quizId } = useParams()
    const contentRef = useRef(null)
    const { handleSubmit } = useForm<IQuestion>()

    const [score, setScore] = useState(0)
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false)
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({})
    const [isAnswerDisabled, setIsAnswerDisabled] = useState<AnswerDisabledStatus>({})

    const { data: user } = useHttpQuery<IUser>("/api/auth")
    const { data: questions = [], loading } = useHttpQuery<IQuestion[]>(`/api/questions/${quizId}`)
    const [submitQuizResult, e_1, isSubmitted] = useHttpMutation<IQuizResult, IQuizResult>(() => {
        notify("success", "Your quiz has been submitted successfully! 🎉")
        setTimeout(() => router.push("/admin/quizzes"), 2700)
    })

    const totalQuestions = (questions ?? []).length
    const allAnswered = useMemo(() => Object.keys(selectedAnswers).length === totalQuestions, [selectedAnswers, totalQuestions])

    const handleAnswerClick = useCallback(async (id: number, answer: string) => {
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
                    setScore(prevScore => prevScore + 1)
                }
            } else {
                console.error(`Error checking answer:${data.message}`)
            }

        } catch (err) {
            console.error(`Error checking answer:${err}`)
        } finally {
            setIsCheckingAnswer(false)
        }
    }, [])

    const handleSubmitResult = useCallback(async () => {
        if (!allAnswered) {
            notify("error", "Please answer all the questions before submitting.")
            return
        }

        const answers = Object.entries(selectedAnswers).map(([id, answer]) => ({
            id: +id,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect,
        }))

        const now = new Date()
        const completedAt = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString()

        const result: IQuizResult = {
            userId: user.id,
            quizId: Number(quizId),
            answers,
            completedAt
        }

        await submitQuizResult(`/api/quizzes/${quizId}`, METHODS.POST, result)
    }, [allAnswered, selectedAnswers])

    return (
        <Layout>
            <ToastContainer />
            <Loader isLoading={loading || isCheckingAnswer || isSubmitted} />
            <section ref={contentRef} className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 flex justify-center items-center">
                <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h1 className="text-4xl font-bold text-center mb-3 tracking-wide bg-gradient-to-bl from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent">Quiz Time!</h1>
                    {!questions || questions.length === 0 ? (
                        <UnavailableMessage message="No questions available for this quiz" />
                    ) : (
                        <>
                            <p className="text-gray-300 text-center mb-6 text-xl max-w-xl mx-auto tracking-wide">
                                Test your knowledge by answering the following questions.
                            </p>
                            <form onSubmit={handleSubmit(handleSubmitResult)} className="space-y-4">
                                <ul className="space-y-4">
                                    {questions.map(({ id, answers, question }, idx) => (
                                        <li key={id} className="bg-gray-700 p-5 rounded-lg shadow-md">
                                            <div className="grid mb-2">
                                                <p className="text-sm font-semibold text-gray-300">
                                                    Question {idx + 1} of {totalQuestions}
                                                </p>
                                                <hr className="w-full mt-1 text-gray-300" />
                                            </div>
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
                                    ${!allAnswered
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                                        }`}
                                >
                                    Submit Answers
                                </button>
                            </form>
                        </>
                    )}
                    {score !== null && totalQuestions > 0 && (
                        <div className="fixed top-1/4 right-6 transform -translate-y-1/2 p-4 rounded-xl shadow-xs w-max tracking-wide bg-gray-800 text-gray-300">
                            {score === totalQuestions ? (
                                <div className="rounded-2xl">
                                    <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 from-0% via-yellow-500 via-50% to-red-400 to-100%">
                                        <span className="text-black text-4xl">🏅</span>Perfect Score<span className="text-black text-4xl">🏅</span>
                                    </h2>
                                    <p className="text-center text-lg font-semibold tracking-wider text-white mt-2">
                                        You got {score} out of {totalQuestions} correct!
                                    </p>
                                    <div className="flex justify-center mt-4">
                                        {[...Array(3)].map((_, i) => (
                                            <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                                                👏
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <h2 className="bg-gray-800 rounded-lg text-gray-200 text-xl font-bold text-center">
                                    Your Performance: {score} / {totalQuestions}
                                </h2>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <ScrollButton />
        </Layout>
    )
}
