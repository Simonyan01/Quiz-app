"use client"

import { useHttpMutation, useHttpQuery } from '@/_helpers/hooks/useHttp'
import { ErrorMessage } from '@/_components/common/ErrorMessage'
import { IUser, METHODS } from '@/_helpers/types/types'
import { Layout } from '@/_components/layout/Layout'
import { Loader } from '@/_components/UI/Loader'
import { notify } from '@/_helpers/hooks/notify'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface IFormData {
    oldPassword: string
    newLogin?: string
    newPassword: string
}

export default function Settings() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>()

    const { data } = useHttpQuery<IUser>("/api/auth")
    const { id } = data ?? {}

    const [changeSettings, error, loading] = useHttpMutation<any, IFormData>(() => {
        notify('success', 'Settings changed successfully')
        setTimeout(() => router.push("/admin"), 3000);
        reset()
    })

    const onSubmit = (data: IFormData) => {
        try {
            const newData = { ...data, userId: id }
            changeSettings("/api/settings", METHODS.POST, newData)
        } catch (err) {
            notify('error', 'Failed to change password')
        }
    }

    return (
        <Layout>
            <ToastContainer />
            <section className="flex justify-center items-center min-h-screen bg-gray-900">
                <Loader isLoading={loading} />
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-sm w-full tracking-wide border border-gray-700">
                    <h2 className={`text-3xl font-semibold text-center text-gray-200 ${error ? "mb-6" : "mb-4"}`}>General security</h2>
                    <ErrorMessage message={error} />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="old-password">Old Password <wbr />
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="password"
                                id="old-password"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                {...register('oldPassword', { required: 'Old password is required' })}
                            />
                            {errors.oldPassword && <p className="text-orange-600 mt-2">{errors.oldPassword.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="new-login">New Login</label>
                            <input
                                id="new-login"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                {...register('newLogin', {
                                    minLength: { value: 3, message: "Username must be at least 3 characters long" },
                                    maxLength: { value: 20, message: "Username must not exceed 20 characters" },
                                    pattern: {
                                        value: /^[a-zA-Z][a-zA-Z0-9_.]{3,20}$/,
                                        message: `Username must start with a letter and contain only letters, numbers, underscore, and dot (3-20 characters)`,
                                    },
                                })}
                            />
                            {errors.newLogin && <p className="text-orange-600 mt-2">{errors.newLogin.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="new-password">New Password <wbr />
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none transition-all focus:ring-2 focus:ring-indigo-500"
                                {...register('newPassword', { required: 'New password is required' })}
                            />
                            {errors.newPassword && <p className="text-orange-600 mt-2">{errors.newPassword.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-700 cursor-pointer text-gray-200 px-3 py-2 tracking-wide rounded-lg text-2xl font-bold shadow-md hover:bg-gray-200 hover:text-indigo-600 transition-all duration-200"
                        >
                            Change
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}
