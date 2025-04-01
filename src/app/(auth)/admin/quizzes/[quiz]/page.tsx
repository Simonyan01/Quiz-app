"use client"

import { useHttpQuery } from "@/_helpers/hooks/useHttp"
import { IQuiz } from "@/_helpers/types/types"

export default function QuizPage() {
    const { data, loading } = useHttpQuery<IQuiz>("/api/quizzes")
    console.log(data);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-green-400 text-center mb-4">
                    16. JS Ultimate, բաժին 1, ավարտվում
                </h1>
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Level: <span className="text-red-400">Medium</span></span>
                    <span>Questions: 25</span>
                </div>
                <p className="text-gray-300 mt-2">
                    Մոդուլի ավարտական թեստ, JS Ultimate գրքի մաս 1-ից
                </p>
                <div className="bg-gray-700 p-4 mt-4 rounded-md">
                    <h2 className="text-lg font-semibold">Question 1/25</h2>
                    <div className="bg-gray-900 p-4 rounded-md mt-2">
                        <pre className="text-yellow-400 text-sm">
                            {`let num = (1,2,3,4)console.log(num)`}
                        </pre>
                    </div>
                    <div className="mt-4 grid gap-2">
                        <button className="bg-gray-600 p-2 rounded hover:bg-gray-500 w-full text-left">
                            SyntaxError
                        </button>
                        <button className="bg-gray-600 p-2 rounded hover:bg-gray-500 w-full text-left">
                            4
                        </button>
                        <button className="bg-gray-600 p-2 rounded hover:bg-gray-500 w-full text-left">
                            1
                        </button>
                    </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-md mt-6 text-center">
                    <h3 className="text-yellow-400 font-semibold">Quiz Results</h3>
                    <p>Overall answers: <span className="text-green-400">0/25</span></p>
                    <p>Correct Answers: <span className="text-green-400">0</span></p>
                </div>
            </div>
        </div>
    )
}
