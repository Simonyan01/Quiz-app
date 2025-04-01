"use client"

import { useHttpMutation, useHttpQuery } from '@/_helpers/hooks/useHttp'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IQuiz, METHODS } from '@/_helpers/types/types'
import { Layout } from '@/_components/layout/Layout'
import { useRouter } from 'next/navigation'

interface IParams {
    id: string
}

const EditQuiz = ({ id }: IParams) => {
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<IQuiz>()

    const { data, error } = useHttpQuery<IQuiz[]>(`/api/quizzes/${id}`)
    const [updateQuiz] = useHttpMutation<any, IQuiz>((data) => console.log(data))
    console.log(data)

    const onSubmit: SubmitHandler<IQuiz> = (formData) => {
        try {
            updateQuiz(`/api/quizzes/${id}`, METHODS.PUT, formData)
            router.push('/admin/quizzes')
        } catch (err) {
            console.error('Error updating quiz')
        }
    }

    return (
        <Layout>
            <section className="max-w-3xl mx-auto p-6 bg-gray-800 shadow-md rounded-lg mt-10">
                <h1 className="text-3xl font-semibold text-white mb-6">Edit Quiz</h1>
                {error && <p className="text-red-400 mb-4 text-2xl animate-bounce font-semibold tracking-wide">{error}</p>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-300">Title</label>
                        <input
                            type="text"
                            id="title"
                            {...register('title', { required: 'Title is required' })}
                            className="mt-2 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-lg font-medium text-gray-300">Description</label>
                        <textarea
                            id="description"
                            {...register('description')}
                            className="mt-2 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white"
                            rows={4}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}

export default EditQuiz
