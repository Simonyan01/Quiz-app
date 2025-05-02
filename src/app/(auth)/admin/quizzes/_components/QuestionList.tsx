"use client"

import { CodeEditor } from "@/_components/UI/CodeEditor"
import { IQuiz } from "@/_helpers/types/types"
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"


interface QuestionBlockProps {
    idx: number
    field: any
    fieldsLength: number
    watch: UseFormWatch<IQuiz>
    errors: FieldErrors<IQuiz>
    append: (val: any) => void
    remove: (idx: number) => void
    register: UseFormRegister<IQuiz>
    setValue: UseFormSetValue<IQuiz>
}

export const scrollToEnd = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

export const QuestionList = ({ idx, field, watch, register, setValue, errors, append, remove, fieldsLength }: QuestionBlockProps) => {
    const questionErrors = errors?.questions?.[idx]

    const handleDublicate = () => {
        append({ ...watch(`questions.${idx}`) })
        setTimeout(scrollToEnd, 300)
    }

    return (
        <div key={field.id} className="p-4 border border-gray-600 rounded-lg">
            <label className="block mb-1">Question {idx + 1}</label>
            <CodeEditor
                idx={idx}
                watch={watch}
                register={register}
                value={watch(`questions.${idx}.question`)}
                onChange={(val) => setValue(`questions.${idx}.question`, val)}
            />
            {questionErrors?.question && (
                <p className="text-red-500 pt-2">{questionErrors.question.message}</p>
            )}
            <div className="mt-2">
                <label className="block mb-1">
                    Answers <span className="text-red-500">*</span>
                </label>
                <div>
                    {questionErrors?.answers && questionErrors.answers.length !== 0 && (
                        <p className="text-red-500">Answers are required for this question.</p>
                    )}
                </div>
                {field.answers.map((_: any, answerIdx: number) => (
                    <div key={answerIdx}>
                        <input
                            {...register(`questions.${idx}.answers.${answerIdx}` as const, {
                                required: "Answers are required for this question."
                            })}
                            className="w-full p-2 rounded bg-gray-700 border transition-all border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-[5px]"
                            placeholder={`Answer ${answerIdx + 1}`}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-2">
                <label className="block mb-1">
                    Correct answer <span className="text-red-500">*</span>
                </label>
                <input
                    {...register(`questions.${idx}.correctAnswer` as const, {
                        required: 'Correct answer is required.'
                    })}
                    className="w-full p-2 rounded bg-gray-700 border transition-all border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter correct answer"
                />
                {questionErrors?.correctAnswer && (
                    <p className="text-red-500 pt-2">{questionErrors.correctAnswer.message}</p>
                )}
            </div>
            <div className="flex gap-4 items-center mt-3">
                <button
                    type="button"
                    onClick={handleDublicate}
                    className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                >
                    Duplicate
                </button>
                {fieldsLength > 1 && (
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
    )
}