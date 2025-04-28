"use client"

import { IQuiz, IQuizResult, IUser } from "@/_helpers/types/types"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { QuizResultList } from "./_components/QuizResultList"
import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { useRef } from "react"

export default function QuizResults() {
    const contentRef = useRef<HTMLElement>(null)

    const { data: users = [] } = useHttpQuery<IUser[]>("/api/users")
    const { data: quizzes = [] } = useHttpQuery<IQuiz[]>("/api/quizzes")
    const { data: quizResults = [], loading } = useHttpQuery<IQuizResult[]>("/api/quiz-results")

    return (
        <Layout>
            <section
                className="min-h-screen flex items-center pb-9 justify-center bg-gray-900 text-gray-200 p-6"
                ref={contentRef}
            >
                <Loader isLoading={loading} />
                <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-5xl font-bold tracking-wide bg-gradient-to-bl from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent text-center mb-5">
                        Quiz Results
                    </h2>
                    <QuizResultList
                        users={users}
                        quizzes={quizzes}
                        results={quizResults}
                    />
                </div>
            </section>
            <ScrollButton />
        </Layout>
    )
}