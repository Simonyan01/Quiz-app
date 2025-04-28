"use client"

import { QuestionBlock, scrollToEnd } from "@/_components/common/QuestionBlock"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { IQuiz, IUser, METHODS } from "@/_helpers/types/types"
import { Layout } from "@/_components/layout/Layout"
import { useEffect, useRef, useState } from "react"
import { Loader } from "@/_components/UI/Loader"
import { notify } from "@/_helpers/hooks/notify"
import { ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface IEditQuizProps {
    mode: string
    loading: boolean
    initialData: IQuiz
    quizId: number
}

export default function AddQuizForm({ mode, loading, initialData, quizId }: IEditQuizProps) {
    const router = useRouter()
    const contentRef = useRef(null)
    const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null)
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<IQuiz>()

    const isEdit = mode === "edit"
    const { title, description, questions = [] } = errors
    const quizImage = useWatch({ control, name: "image" })
    const { fields, append, remove } = useFieldArray({ control, name: "questions" })

    const { data } = useHttpQuery<IUser>("/api/auth")
    const userId = data?.id

    const [createOrUpdate, e1, isSubmitting] = useHttpMutation<any, FormData>()

    const onSubmit = async (form: IQuiz) => {
        const formData = new FormData()
        formData.append("id", String(form.id))
        formData.append("title", form.title)
        formData.append("description", form.description)
        formData.append("createdBy", String(userId))

        if (form.image) {
            formData.append("image", form.image)
        } else {
            notify("error", "Please upload an image for the quiz!")
            return
        }

        if (!form.questions || form.questions.length < 15) {
            notify("error", "Please add a minimum of 15 questions to create the quiz!!!")
            return
        }

        form.questions.forEach((q, idx) => {
            formData.append(`questions[${idx}][question]`, q.question)
            q.answers.forEach((answer, aIdx) => {
                formData.append(`questions[${idx}][answers][${aIdx}]`, answer)
            })
            formData.append(`questions[${idx}][correctAnswer]`, q.correctAnswer)
        })

        const url = isEdit ? `/api/quizzes/${quizId}` : "/api/quizzes"
        const method = isEdit ? METHODS.PUT : METHODS.POST

        try {
            await createOrUpdate(url, method, formData)
            notify("success", `Quiz successfully ${isEdit ? "updated" : "added"}. Redirecting to quiz list.`)
            setTimeout(() => router.push("/admin/quizzes"), 2500)
        } catch {
            notify("error", `Failed to ${isEdit ? "update" : "add"} quiz!`)
        }
    }

    const handleAdd = () => {
        append({
            question: "",
            answers: ["", "", "", ""],
            correctAnswer: ""
        })
        setTimeout(scrollToEnd, 300)
    }

    useEffect(() => {
        if (quizImage instanceof File) {
            const objectUrl = URL.createObjectURL(quizImage)
            setPreviewImageSrc(objectUrl)

            return () => {
                URL.revokeObjectURL(objectUrl)
                setPreviewImageSrc(null)
            }
        } else if (typeof quizImage === "string") {
            setPreviewImageSrc(`/uploads/quizzes/${quizImage}`)
        } else {
            setPreviewImageSrc(null)
        }
    }, [quizImage])

    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData])
    return (
        <Layout>
            <ToastContainer />
            <Loader isLoading={isSubmitting || loading} />
            <section className="max-w-4xl mx-auto bg-gray-800 text-white p-6 m-12 rounded-lg shadow-lg tracking-wider" ref={contentRef}>
                <h2 className="text-3xl font-bold mb-3 text-center">
                    {isEdit ? "Update Quiz" : "Create Quiz"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-1">Title <wbr />
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("title", { required: "Title is required." })}
                            className="w-full p-2 rounded transition-all bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quiz title"
                        />
                        {title && <p className="text-red-500 pt-2">{title.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-1">Description <wbr />
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("description", { required: "Description is required." })}
                            className="w-full p-2 rounded bg-gray-700 border transition-all border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quiz description"
                        />
                        {description && <p className="text-red-500">{description.message}</p>}
                    </div>
                    <div>
                        <label
                            htmlFor="quizImage"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm transition-all font-semibold py-2 px-4 rounded-lg cursor-pointer"
                        >
                            {quizImage instanceof File ? quizImage.name
                                : typeof quizImage === "string" ? quizImage
                                    : "Choose image"
                            }
                        </label>
                        <input
                            id="quizImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setValue("image", file)
                                }
                            }}
                        />
                        {previewImageSrc && (
                            <Image
                                src={previewImageSrc}
                                alt="Quiz image"
                                width={280}
                                height={200}
                                className="mt-4 rounded-xl border border-blue-400 shadow-xs"
                                draggable={false}
                                priority
                            />
                        )}
                    </div>
                    <h3 className="text-xl font-semibold">Questions</h3>
                    {fields.map((field, idx) => (
                        <QuestionBlock
                            key={field.id}
                            idx={idx}
                            field={field}
                            watch={watch}
                            register={register}
                            setValue={setValue}
                            questions={questions as any[]}
                            append={append}
                            remove={remove}
                            fieldsLength={fields.length}
                        />
                    ))}
                    <button
                        type="button"
                        className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer transition-all p-2 rounded-lg text-white"
                        onClick={handleAdd}
                    >
                        {fields.length === 0 ? "Add question" : "Add another question"}
                    </button>
                    <button
                        type="submit"
                        className="w-full bg-green-600 cursor-pointer hover:bg-green-500  transition-all p-2 rounded-lg text-white"
                    >
                        {isEdit ? "Update Quiz" : "Create Quiz"}
                    </button>
                </form>
            </section>
            <ScrollButton />
        </Layout>
    )
}
