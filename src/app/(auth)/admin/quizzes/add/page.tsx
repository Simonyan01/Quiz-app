"use client"

import { useHttpMutation, useHttpQuery } from "@/_helpers/hooks/useHttp"
import { ScrollButton } from "@/_components/common/ScrollButton"
import { IQuiz, IUser, METHODS } from "@/_helpers/types/types"
import { CodeEditor } from "@/_components/UI/CodeEditor"
import { useForm, useFieldArray } from "react-hook-form"
import { Layout } from "@/_components/layout/Layout"
import { Loader } from "@/_components/UI/Loader"
import { notify } from "@/_helpers/hooks/notify"
import { ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import { useMemo, useRef } from "react"

export default function QuizForm() {
    const router = useRouter()
    const contentRef = useRef(null)
    const defaultValues = useMemo(() => ({
        title: "Types of JavaScript",
        description: "A quiz to test your knowledge of JavaScript types.",
        questions: [
            {
                question: "What is the type of `null` in JavaScript?",
                answers: ["object", "null", "undefined", "string"],
                correctAnswer: "object",
            },
            {
                question: "Which of the following is NOT a primitive data type in JavaScript?",
                answers: ["string", "number", "object", "boolean"],
                correctAnswer: "object",
            },
            {
                question: "What is the result of `typeof NaN`?",
                answers: ["number", "string", "undefined", "object"],
                correctAnswer: "number",
            },
            {
                question: "What does `typeof []` return in JavaScript?",
                answers: ["object", "array", "undefined", "function"],
                correctAnswer: "object",
            },
            {
                question: "Which of the following values is falsy in JavaScript?",
                answers: ["0", "'0'", "true", "[]"],
                correctAnswer: "0",
            },
            {
                question: "What is the type of `Symbol()` in JavaScript?",
                answers: ["string", "symbol", "object", "function"],
                correctAnswer: "symbol",
            },
            {
                question: "Which of the following is NOT a valid object in JavaScript?",
                answers: ["{ key: 'value' }", "[1, 2, 3]", "new Date()", "null"],
                correctAnswer: "null",
            },
            {
                question: "What does `typeof undefined` return?",
                answers: ["undefined", "object", "string", "number"],
                correctAnswer: "undefined",
            },
            {
                question: "Which method can be used to convert a string to a number?",
                answers: ["parseInt()", "toNumber()", "convert()", "stringToInt()"],
                correctAnswer: "parseInt()",
            },
            {
                question: "Which operator is used to assign a value to a variable in JavaScript?",
                answers: ["=", "==", "===", ":="],
                correctAnswer: "=",
            },
            {
                question: "Which of the following is NOT a valid way to declare a variable in JavaScript?",
                answers: ["let", "var", "const", "set"],
                correctAnswer: "set",
            },
        ]
    }), [])
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<IQuiz>({ defaultValues })

    const { title, description, questions = [] } = errors
    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    })

    const { data } = useHttpQuery<IUser>("/api/auth")
    const { id } = data ?? {}

    const [addQuiz, _, loading] = useHttpMutation<any, IQuiz>(() => {
        setTimeout(() => router.push("/admin/quizzes"), 3000)
        reset()
    })

    const onSubmit = async (data: IQuiz) => {
        try {
            if (data.questions?.length === 0) {
                notify("error", "Please add at least one question to the quiz !!!")
                return
            }

            await addQuiz("/api/quizzes", METHODS.POST, { ...data, createdBy: id })
            notify("success", "Quiz successfully added!")
        } catch {
            notify("error", "Failed to add quiz!")
        }
    }

    return (
        <Layout>
            <ToastContainer />
            <Loader isLoading={loading} />
            <section className="max-w-4xl mx-auto bg-gray-800 text-white p-6 m-12 rounded-lg shadow-lg tracking-wider" ref={contentRef}>
                <h2 className="text-3xl font-bold mb-3 text-center">Add Quiz</h2>
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
                    <h3 className="text-xl font-semibold">Questions</h3>
                    {fields.map((field, idx) => (
                        <div key={field.id} className="p-4 border border-gray-600 rounded-lg">
                            <label className="block mb-1 ">Question {idx + 1}</label>
                            <CodeEditor
                                idx={idx}
                                watch={watch}
                                register={register}
                                value={watch(`questions.${idx}.question`)}
                                onChange={(val) => setValue(`questions.${idx}.question`, val)}
                            />
                            {questions[idx]?.question && (
                                <p className="text-red-500 pt-2">{questions[idx].question?.message}</p>
                            )}
                            <div className="mt-2">
                                <label className="block mb-1"> Answers <wbr />
                                    <span className="text-red-500">*</span>
                                </label>
                                <div>
                                    {questions[idx]?.answers && questions[idx].answers.length !== 0 && (
                                        <p className="text-red-500 pt-2">Answers are required for this question.</p>
                                    )}
                                </div>
                                {field.answers.map((_, answerIdx) => (
                                    <div key={answerIdx}>
                                        <input
                                            {...register(`questions.${idx}.answers.${answerIdx}` as const, { required: true })}
                                            className="w-full p-2 rounded bg-gray-700  border transition-all border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-[5px]"
                                            placeholder={`Answer ${answerIdx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2">
                                <label className="block mb-1"> Correct answer <wbr />
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register(`questions.${idx}.correctAnswer` as const, { required: "Correct answer is required." })}
                                    className="w-full p-2 rounded bg-gray-700 border transition-all border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter correct answer"
                                />
                                {questions[idx]?.correctAnswer && (
                                    <p className="text-red-500 pt-2">{questions[idx].correctAnswer?.message}</p>
                                )}
                            </div>
                            <div className="flex gap-4 items-center mt-3">
                                <button
                                    type="button"
                                    onClick={() => append({ ...watch(`questions.${idx}`) })}
                                    className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                                >
                                    Duplicate
                                </button>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-amber-600 rounded-lg cursor-pointer shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ question: "", answers: ["", "", "", ""], correctAnswer: "" })}
                        className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer transition-all p-2 rounded text-white"
                    >
                        {fields.length === 0 ? "Add question" : "Add another question"}
                    </button>
                    <button
                        type="submit"
                        className="w-full bg-green-600 cursor-pointer hover:bg-green-500  transition-all p-2 rounded text-white"
                    >
                        Submit quiz
                    </button>
                </form>
            </section>
            <ScrollButton targetRef={contentRef} />
        </Layout>
    )
}
