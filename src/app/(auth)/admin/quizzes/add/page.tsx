"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { QuestionBlock } from "@/_components/common/QuestionBlock"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { IQuiz, IUser, METHODS } from "@/_helpers/types/types"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { notify } from "@/_helpers/hooks/notify"
import { ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef } from "react"
import Image from "next/image"

interface IEditQuizProps {
    mode: string
    loading: boolean
    initialData: IQuiz
    quizId: number
}

export default function QuizForm({ mode, loading, initialData, quizId }: IEditQuizProps) {
    const router = useRouter()
    const contentRef = useRef<HTMLDivElement>(null)
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<IQuiz>()

    const { title, description, questions = [] } = errors
    const quizImage = useWatch({ control, name: "image" })
    const imageSrc: string | null = useMemo(() => {
        if (quizImage instanceof File) {
            return URL.createObjectURL(quizImage)
        } else if (typeof quizImage === "string") {
            return `/uploads/quizzes/${quizImage}`
        }
        return null
    }, [quizImage])

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    })

    const [createOrUpdate, e1, isSubmitting] = useHttpMutation<any, FormData>()
    const { data } = useHttpQuery<IUser>("/api/auth")
    const userId = data?.id

    const onSubmit = async (form: IQuiz) => {
        const formData = new FormData()
        formData.append("id", String(form.id))
        formData.append("title", form.title)
        formData.append("description", form.description)
        formData.append("createdBy", String(userId))

        if (form.image) {
            formData.append("image", form.image)
        } else {
            notify("error", "Please upload an image for the quiz !")
            return
        }

        if (!form.questions || form.questions.length <= 10) {
            notify("error", "Please add at least one question to the quiz !!!")
            return
        }

        form.questions.forEach((q, idx) => {
            formData.append(`questions[${idx}][question]`, q.question)
            q.answers.forEach((answer, aIdx) => {
                formData.append(`questions[${idx}][answers][${aIdx}]`, answer)
            })
            formData.append(`questions[${idx}][correctAnswer]`, q.correctAnswer)
        })

        const isEdit = Boolean(initialData)
        const url = isEdit ? `/api/quizzes/${quizId}` : "/api/quizzes"
        const method = isEdit ? METHODS.PUT : METHODS.POST

        try {
            await createOrUpdate(url, method, formData)
            notify("success", `Quiz successfully ${isEdit ? "updated" : "added"}!`)
            setTimeout(() => router.push("/admin/quizzes"), 2500)
        } catch {
            notify("error", `Failed to ${isEdit ? "update" : "add"} quiz!`)
        }
    }

    // useEffect(() => {
    //     return () => {
    //         if (quizImage instanceof File && imageSrc) {
    //             URL.revokeObjectURL(imageSrc)
    //         }
    //     }
    // }, [quizImage, imageSrc])


    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData, reset])

    return (
        <Layout>
            <ToastContainer />
            <Loader isLoading={isSubmitting || loading} />
            <section className="max-w-4xl mx-auto bg-gray-800 text-white p-6 m-12 rounded-lg shadow-lg tracking-wider" ref={contentRef}>
                <h2 className="text-3xl font-bold mb-3 text-center">
                    {mode === "edit" ? "Update Quiz" : "Create Quiz"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-1"> Title <wbr />
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
                        <label className="block mb-1">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required." })}
                            className="w-full p-2 rounded bg-gray-700 border transition-all border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter quiz description"
                        />
                        {description && <p className="text-red-500">{description.message}</p>}
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            className="min-w-max text-sm cursor-pointer file:cursor-pointer text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setValue("image", file)
                                }
                            }}
                        />
                        {imageSrc && (
                            <Image
                                src={imageSrc}
                                alt="Quiz image"
                                width={300}
                                height={200}
                                className="mt-4 rounded-xl border border-blue-400 shadow-xs"
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
                        className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer transition-all p-2 rounded text-white"
                        onClick={() => append({
                            question: "",
                            answers: ["", "", "", ""],
                            correctAnswer: ""
                        })}
                    >
                        {fields.length === 0 ? "Add question" : "Add another question"}
                    </button>
                    <button
                        type="submit"
                        className="w-full bg-green-600 cursor-pointer hover:bg-green-500  transition-all p-2 rounded text-white"
                    >
                        {mode === "edit" ? "Update Quiz" : "Create Quiz"}
                    </button>
                </form>
            </section>
            <ScrollButton targetRef={contentRef} />
        </Layout >
    )
}
