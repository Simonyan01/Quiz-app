import { UseFormRegister, FieldErrors } from "react-hook-form"
import { IQuiz } from "@/_helpers/types/types"

export function QuizHeader({ register, errors }: {
    register: UseFormRegister<IQuiz>,
    errors: FieldErrors<IQuiz>
}) {
    return (
        <>
            <div>
                <label className="block mb-1">Title <span className="text-red-500">*</span></label>
                <input
                    {...register("title", { required: "Title is required." })}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quiz title"
                />
                {errors.title && <p className="text-red-500 pt-2">{errors.title.message}</p>}
            </div>
            <div>
                <label className="block mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                    {...register("description", { required: "Description is required." })}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quiz description"
                />
                {errors.description && <p className="text-red-500 pt-2">{errors.description.message}</p>}
            </div>
        </>
    )
}
