"use client"

import { useHttpQuery } from '@/_helpers/hooks/useHttp'
import { IQuiz } from '@/_helpers/types/types'
import { useParams } from 'next/navigation'
import QuizForm from '../../add/page'

export default function EditQuiz() {
    const { id } = useParams()
    const { data: quiz, loading } = useHttpQuery<IQuiz>(`/api/quizzes/${id}`)

    return (
        <QuizForm
            mode="edit"
            loading={loading}
            initialData={quiz}
            quizId={Number(id)}
        />
    )
}
