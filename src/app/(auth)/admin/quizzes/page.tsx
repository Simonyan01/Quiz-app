"use client"

import { DeleteConfirmModal } from "@/_components/common/DeleteConfirmModal"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { UnavailableMessage } from "@/_components/UI/UnavailableMessage"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { IQuiz, METHODS } from "@/_helpers/types/types"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { FaCheckCircle } from "react-icons/fa"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Quizzes() {
    const router = useRouter()
    const contentRef = useRef<HTMLElement>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null)

    const { data: quizzes = [], loading, refetch } = useHttpQuery<IQuiz[]>("/api/quizzes")
    const [deleteQuiz, e_1, isRemoved] = useHttpMutation<any, any>(refetch)

    const handleEdit = (id: number, e: MouseEvent) => {
        e.stopPropagation()
        router.push(`/admin/quizzes/edit/${id}`)
    }

    const handleDelete = async (id: number, e: MouseEvent) => {
        e.stopPropagation()
        setSelectedQuizId(id)
        setOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (selectedQuizId !== null) {
            try {
                await deleteQuiz(`/api/quizzes/${selectedQuizId}`, METHODS.DELETE)
            } catch (err) {
                console.error(`Failed to delete quiz:${err}`)
            } finally {
                setOpen(false)
                setSelectedQuizId(null)
            }
        }
    }

    const handleRedirect = (id: number) => {
        router.push(`/admin/quizzes/${id}`)
    }

    useEffect(() => {
        const content = contentRef.current
        if (content) {
            if (open) {
                content.setAttribute("inert", "true")
            } else {
                content.removeAttribute("inert")
            }
        }
    }, [open])
    return (
        <Layout>
            <section className="min-h-screen flex items-center pb-10 justify-center bg-gray-900 text-gray-200 p-6" ref={contentRef}>
                <Loader isLoading={loading || isRemoved} />
                <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-5xl font-bold tracking-wide bg-gradient-to-bl from-[#ff5330] via-[#f09819] to-[#ff5330] bg-clip-text text-transparent text-center mb-5">
                        Quizzes
                    </h2>
                    {!quizzes || quizzes.length === 0 ? (
                        <UnavailableMessage
                            message="No quizzes available"
                            additionalMessage="for new quizzes"
                        />
                    ) : (
                        <ul className="space-y-6">
                            {quizzes.map(({ id, title, description, image, passed }) => (
                                <li
                                    key={id}
                                    onClick={() => handleRedirect(id)}
                                    className="group flex items-center w-full p-4 bg-gray-700 rounded-2xl shadow-md cursor-pointer transition duration-300 hover:scale-105"
                                >
                                    {image && (
                                        <div className="w-48 h-34 flex-shrink-0 overflow-hidden rounded-xl mr-8 shadow-md">
                                            <Image
                                                src={`/uploads/quizzes/${image}`}
                                                alt="Quiz preview"
                                                width={192}
                                                height={136}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                draggable={false}
                                                priority
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                            {title}
                                            {passed && (
                                                <FaCheckCircle className="text-green-400" title="Passed quiz" />
                                            )}
                                        </h3>
                                        <p className="text-lg text-gray-300">{description}</p>
                                    </div>
                                    <div className="grid gap-4 ml-6 mr-3">
                                        <button
                                            type="button"
                                            onClick={(evt) => handleEdit(id, evt)}
                                            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md tracking-wide cursor-pointer text-white font-medium shadow-md hover:shadow-lg transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(evt) => handleDelete(id, evt)}
                                            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md tracking-wide cursor-pointer text-white font-medium shadow-md hover:shadow-lg transition"
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
            <ScrollButton />
            <DeleteConfirmModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirm Quiz Deletion"
                message="Are you sure you want to delete this quiz? This can't be undone."
            />
        </Layout>
    )
}
