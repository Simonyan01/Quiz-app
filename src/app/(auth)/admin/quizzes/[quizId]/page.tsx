"use client"

import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { Layout } from "@/_components/layout/Layout"
import { IQuestion } from "@/_helpers/types/types"
import { Loader } from "@/_components/UI/Loader"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"

export default function QuizPage() {
    const params = useParams()
    const { quizId } = params
    const contentRef = useRef(null)
    const { data: questions, loading } = useHttpQuery<IQuestion[]>(`/api/questions/${quizId}`)
    const { register, handleSubmit } = useForm<IQuestion>()
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
    const [disabledAnswers, setDisabledAnswers] = useState<Record<number, boolean>>({});

    const handleAnswerClick = (id: number, answer: string, correctAnswer: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [id]: {
                selected: answer,
                isCorrect: answer === correctAnswer,
            },
        }));

        if (answer === correctAnswer) {
            setDisabledAnswers((prev) => ({
                ...prev,
                [id]: true,
            }));
        }
    };

    const onSubmit = (data: IQuestion) => {
        console.log("User Answers:", data)
    }

    return (
        <Layout>
            <Loader isLoading={loading} />
            <section ref={contentRef} className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 flex justify-center items-center">
                <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h1 className="text-4xl font-bold text-center mb-6 tracking-wide text-indigo-400">Quiz Time!</h1>
                    {!questions || questions.length === 0 ? (
                        <UnavailableMessage message="No questions available for this quiz" />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <ul className="space-y-4">
                                {questions.map(({ id, answers, question, correctAnswer }) => (
                                    <li key={id} className="bg-gray-700 p-5 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
                                            {question}
                                        </h3>
                                        <ul className="space-y-2">
                                            {answers.map((answer, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => handleAnswerClick(id, answer, correctAnswer)}
                                                    style={{ pointerEvents: disabledAnswers[id] ? "none" : "auto" }}
                                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-[18px] transition-all ease-linear text-gray-200 
                                                    ${selectedAnswers[id]?.selected === answer ?
                                                            (selectedAnswers[id]?.isCorrect ? "bg-green-600" : "bg-red-400") :
                                                            "bg-gray-600 hover:bg-gray-500"
                                                        }`}
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
                        </form>
                    )}
                </div>
            </section>
            <ScrollButton targetRef={contentRef} />
        </Layout >
    )
}
