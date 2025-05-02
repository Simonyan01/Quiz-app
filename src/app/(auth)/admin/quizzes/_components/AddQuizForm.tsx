"use client"

import { QuizFormActions } from "@/app/(auth)/admin/quizzes/_components/QuizFormActions"
import { QuizImageUpload } from "@/app/(auth)/admin/quizzes/_components/QuizImageUpload"
import { QuizHeader } from "@/app/(auth)/admin/quizzes/_components/QuizHeader"
import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { IQuiz, IUser, METHODS } from "@/_helpers/types/types"
import { Layout } from "@/_components/layout/Layout"
import { useEffect, useRef, useState } from "react"
import { Loader } from "@/_components/UI/Loader"
import { notify } from "@/_helpers/hooks/notify"
import { ToastContainer } from "react-toastify"
import { QuestionList } from "./QuestionList"
import { useRouter } from "next/navigation"

interface QuizProps {
    mode: string
    loading: boolean
    initialData: IQuiz
    quizId: number | string
}

export default function AddQuizForm({ mode, loading, initialData, quizId }: QuizProps) {
    const router = useRouter()
    const contentRef = useRef(null)
    const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null)
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<IQuiz>()

    const isEdit = mode === "edit"
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

    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData])
    return (
        <Layout>
            <ToastContainer />
            <Loader isLoading={isSubmitting || loading} />
            <section
                ref={contentRef}
                className="max-w-4xl mx-auto bg-gray-800 text-white p-6 m-12 rounded-lg shadow-lg tracking-wider"
            >
                <h2 className="text-3xl font-bold mb-3 text-center">
                    {isEdit ? "Update Quiz" : "Create Quiz"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <QuizHeader register={register} errors={errors} />
                    <QuizImageUpload
                        quizImage={quizImage}
                        setValue={setValue}
                        previewImageSrc={previewImageSrc}
                        setPreviewImageSrc={setPreviewImageSrc}
                    />
                    {fields.map((field, index) => (
                        <QuestionList
                            key={field.id}
                            idx={index}
                            field={field}
                            watch={watch}
                            errors={errors}
                            append={append}
                            remove={remove}
                            setValue={setValue}
                            register={register}
                            fieldsLength={fields.length}
                        />
                    ))}
                    <QuizFormActions fields={fields} append={append} />
                </form>
            </section>
            <ScrollButton />
        </Layout>
    )
}
