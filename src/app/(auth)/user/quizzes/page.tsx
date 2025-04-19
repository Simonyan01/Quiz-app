"use client"

import { ScrollButton } from "@/_components/common/ScrollButton"
import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { IQuiz } from "@/_helpers/types/types"
import { useRef } from "react"

export default function Quizzes() {
    const contentRef = useRef<HTMLDivElement>(null)
    const { data: quizzes = [], loading } = useHttpQuery<IQuiz[]>("/api/quizzes")

    return (
        <Layout>
            {loading && <Loader isLoading={loading} />}
            <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 p-6" ref={contentRef}>
                <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-3xl font-bold text-amber-400 text-center mb-6">Quizzes</h2>
                    {!quizzes ? (
                        <p className="text-gray-400 text-center">No quizzes available 🚀</p>
                    ) : (
                        <ul className="space-y-4">
                            {quizzes.map(({ id, title, description }) => (
                                <li key={id} className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{title}</h3>
                                        <p className="text-gray-400">{description}</p>
                                    </div>
                                    <div className="flex gap-4">

                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
            <ScrollButton targetRef={contentRef} />
        </Layout>
    )
}
