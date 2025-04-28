"use client"

import { useHttpQuery } from '@/_helpers/hooks/useHttp'
import { IQuiz } from '@/_helpers/types/types'
import { useParams } from 'next/navigation'
import AddQuizForm from '../../add/page'

export default function EditQuizForm() {
    const { id } = useParams()
    const { data: quiz, loading } = useHttpQuery<IQuiz>(`/api/quizzes/${id}`)

    return (
        <AddQuizForm
            mode="edit"
            loading={loading}
            initialData={quiz}
            quizId={Number(id)}
        />
    )
}
