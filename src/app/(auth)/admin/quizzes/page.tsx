"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { IQuiz, METHODS } from "@/_helpers/types/types"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { useRouter } from "next/navigation"
import { MouseEvent, useRef } from "react"

export default function Quizzes() {
    const router = useRouter()
    const contentRef = useRef(null)

    const { data = [], loading, refetch } = useHttpQuery<IQuiz[]>("/api/quizzes")
    const [deleteQuiz, e_1, isRemoved, e_2, invalidateCache] = useHttpMutation<any>(() => {
        invalidateCache("/api/quizzes")
        refetch()
    })

    const handleEdit = (id: number, e: MouseEvent) => {
        e.stopPropagation()
        router.push(`/admin/quizzes/edit/${id}`)
    }

    const handleDelete = (id: number, e: MouseEvent) => {
        try {
            e.stopPropagation()
            deleteQuiz(`/api/quizzes/${id}`, METHODS.DELETE)
        } catch (err) {
            console.error(`Failed to delete quiz:${err}`)
        }
    }

    const handleRedirect = (id: number) => {
        router.push(`/admin/quizzes/${id}`)
    }

    return (
        <Layout>
            <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 p-6" ref={contentRef}>
                <Loader isLoading={loading || isRemoved} />
                <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-5xl font-bold tracking-wide bg-gradient-to-bl from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent text-center mb-5">
                        Quizzes
                    </h2>
                    {!data || data.length === 0 ? (
                        <UnavailableMessage
                            message="No quizzes available"
                            additionalMessage="for new quizzes"
                        />
                    ) : (
                        <ul className="space-y-4">
                            {data.map(({ id, title, description }) => (
                                <li
                                    key={id}
                                    onClick={() => handleRedirect(id)}
                                    className="p-4 bg-gray-700 rounded-lg flex justify-between items-center hover:scale-[102%] transition-all cursor-pointer duration-200"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{title}</h3>
                                        <p className="text-gray-400">{description}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={(e) => handleEdit(id, e)}
                                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white transition-all cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(id, e)}
                                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white transition-all cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
            <ScrollButton targetRef={contentRef} />
        </Layout >
    )
}
