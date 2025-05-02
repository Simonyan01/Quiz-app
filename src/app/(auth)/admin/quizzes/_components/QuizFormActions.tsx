import { scrollToEnd } from "./QuestionList"

interface IActionsProps {
    fields: any[],
    append: (value: any) => void
}

export function QuizFormActions({ fields, append }: IActionsProps) {
    const handleAdd = () => {
        append({ question: "", answers: ["", "", "", ""], correctAnswer: "" })
        setTimeout(scrollToEnd, 300)
    }

    return (
        <>
            <button
                type="button"
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-500 p-2 rounded-lg text-white"
                onClick={handleAdd}
            >
                {fields.length === 0 ? "Add question" : "Add another question"}
            </button>

            <button
                type="submit"
                className="w-full bg-green-600 cursor-pointer hover:bg-green-700 font-bold py-2 px-4 rounded text-white"
            >
                Submit Quiz
            </button>
        </>
    )
}
