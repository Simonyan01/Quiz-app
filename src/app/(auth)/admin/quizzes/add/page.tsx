"use client"

import AddQuizForm from "../_components/AddQuizForm"

export default function CreateQuizPage() {
    return (
        <AddQuizForm
            mode="add"
            loading={false}
            initialData={{
                id: 0,
                title: "",
                description: "",
                image: null,
                createdBy: 0,
                questions: [],
            }}
            quizId={0}
        />
    )
}
